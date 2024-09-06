from fastapi import HTTPException
from io import BytesIO
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from config.config import embeddings, session, supabase, AWS_BUCKET_NAME, AWS_REGION
from models.documents import Document, DocumentVector
from langchain_community.document_loaders.parsers import PyPDFParser
from langchain_community.document_loaders.base import BaseLoader
from typing import List, Optional, Union
from langchain_core.documents.base import Blob

class CustomPDFLoader(BaseLoader):
    """
    CustomPDFLoader to load pdf file directly from BytesIO stream.

    """
    def __init__(
        self,
        stream: BytesIO,
        password: Optional[Union[str, bytes]] = None,
        extract_images: bool = False,
    ):
        self.stream = stream
        self.parser = PyPDFParser(password=password, extract_images=extract_images)

    def load(self) -> List[Document]:
        blob = Blob.from_data(self.stream.getvalue())
        return list(self.parser.parse(blob))


def generate_document_vector(pdf_content: bytes):
    """
    Generate document vectors from a PDF file.
    """
    try:
        pdf_stream = BytesIO(pdf_content)
        loader = CustomPDFLoader(pdf_stream)
        documents = loader.load()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading PDF: {str(e)}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        add_start_index=True,
    )
    docs = text_splitter.split_documents(documents)
    docs_string = [str(doc) for doc in docs]
    vectors = embeddings.embed_documents(docs_string)
    return vectors, docs


def store_document_vectors(pdf_content: bytes, document_id: str):
    """
    Generate document vectors and metadata from a PDF file at a given S3 URI and upsert them to a Pinecone index.
    """
    try:
        vectors_list, docs = generate_document_vector(pdf_content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating document vectors: {str(e)}"
        )

    document_vectors = []
    for i, vector in enumerate(vectors_list):
        document_vector = DocumentVector(
            document_id=document_id, vector=vector, metadata=docs[i].dict()
        )
        document_vectors.append(document_vector.to_dict())

    try:
        supabase.table("document_vector").insert(document_vectors).execute()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error upserting to Pinecone index: {str(e)}"
        )


def upload_pdf_to_s3(pdf_content: bytes, filename: str):
    """
    Upload a PDF file to an S3 bucket.
    """
    s3 = session.client("s3")
    try:
        s3.upload_fileobj(BytesIO(pdf_content), AWS_BUCKET_NAME, filename)
        document = Document(
            filename=filename,
            s3_url=f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}",
        )
        response = supabase.table("document").insert(document.to_dict()).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading PDF :{str(e)}")

    return response.data[0]


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

    model = ChatGoogleGenerativeAI(model="gemini-pro")

    prompt = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain
