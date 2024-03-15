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

chatRouter = APIRouter()


class LLMPrompt(BaseModel):
    query: str
    namespace: str


@chatRouter.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if file.filename.endswith(".pdf"):
        pass
    else:
        return {
            "message": f"Invalid file type in {file.filename}. Only PDF files are allowed."
        }

    namespace_id = str(uuid.uuid4())
    file_name = namespace_id + "_" + file.filename.replace(" ", "_")
    S3_URI = await upload_pdf_to_s3(file, file_name)
    upsert_to_pinecone(S3_URI, namespace_id)
    await file.close()
    return {"fileName": file_name, "namespace": namespace_id, "URI": S3_URI}


@chatRouter.post("/conversation")
async def process_llm_prompt(conversation: LLMPrompt):
    query = conversation.query
    text_field = "text"
    namespace = conversation.namespace
    chain = get_conversational_chain()
    vectorstore = Pinecone(
        index, embeddings.embed_query, text_field, namespace=namespace
    )
    docs = vectorstore.similarity_search(query=query, k=7)
    query_response = chain({"input_documents": docs, "question": query})
    return query_response
