from fastapi import UploadFile
from io import BytesIO
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from config.config import embeddings, index, session, AWS_BUCKET_NAME


def generate_document_vector(S3_URI):
    loader = PyPDFLoader(S3_URI)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        add_start_index=True,
    )
    docs = text_splitter.split_documents(documents)
    docs_string = [str(doc) for doc in docs]
    vectors = embeddings.embed_documents(docs_string)
    return vectors, docs


def upsert_to_pinecone(S3_URI, namespace):
    vectors_list, docs = generate_document_vector(S3_URI)
    vectors = [
        {
            "id": f"{i}",
            "values": vector,
            "metadata": docs[i].dict()["metadata"]
            | {"text": docs[i].dict()["page_content"]},
        }
        for i, vector in enumerate(vectors_list)
    ]
    index.upsert(vectors, namespace=namespace)
    print(docs[0])


async def upload_pdf_to_s3(file: UploadFile, filename: str):
    s3 = session.client("s3")
    file_content = await file.read()
    s3.upload_fileobj(BytesIO(file_content), AWS_BUCKET_NAME, filename)
    return f"https://{AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/{filename}"


def get_conversational_chain():

    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatOpenAI()

    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain
