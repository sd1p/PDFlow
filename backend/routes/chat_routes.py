from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import uuid
from langchain_community.vectorstores import Pinecone
from utils.utils import (
    upload_pdf_to_s3,
    upsert_to_pinecone,
    get_conversational_chain,
    index,
    embeddings,
)

# Create a router for chat related endpoints
chatRouter = APIRouter()

# Define a model for the LLM prompt
class LLMPrompt(BaseModel):
    query: str
    namespace: str

# Endpoint to upload a PDF file
@chatRouter.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Check if the file is a PDF
    if not file.filename.endswith(".pdf"):
        return {"message": f"Invalid file type in {file.filename}. Only PDF files are allowed."}

    # Generate a unique ID and file name
    namespace_id = str(uuid.uuid4())
    file_name = namespace_id + "_" + file.filename.replace(" ", "_")

    # Upload the file to S3 and Pinecone
    S3_URI = await upload_pdf_to_s3(file, file_name)
    upsert_to_pinecone(S3_URI, namespace_id)

    await file.close()
    return {"fileName": file_name, "namespace": namespace_id, "URI": S3_URI}

# Endpoint to process a LLM prompt
@chatRouter.post("/conversation")
async def process_llm_prompt(conversation: LLMPrompt):
    # Get the query and namespace
    query = conversation.query
    namespace = conversation.namespace

    # Get the conversational chain and create a Pinecone vector store
    chain = get_conversational_chain()
    vectorstore = Pinecone(index, embeddings.embed_query, "text", namespace=namespace)

    # Perform a similarity search and process the query response
    docs = vectorstore.similarity_search(query=query, k=7)
    query_response = chain({"input_documents": docs, "question": query})

    return query_response