from fastapi import UploadFile
from io import BytesIO
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from config.config import embeddings, index, session, AWS_BUCKET_NAME,AWS_REGION

def generate_document_vector(S3_URI:str):
    """
    Generate document vectors from a PDF file at a given S3 URI.
    """
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

def upsert_to_pinecone(S3_URI: str, namespace: str):
    """
    Generate document vectors and metadata from a PDF file at a given S3 URI and upsert them to a Pinecone index.
    """
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

async def upload_pdf_to_s3(file: UploadFile, filename: str):
    """
    Upload a PDF file to an S3 bucket.
    """
    s3 = session.client("s3")
    file_content = await file.read()
    s3.upload_fileobj(BytesIO(file_content), AWS_BUCKET_NAME, filename)
    return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"

def get_conversational_chain():
    """
    Generate a conversational chain for question answering.
    """
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