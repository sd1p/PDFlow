from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import uuid
import json
from config.config import supabase
from utils.utils import (
    upload_pdf_to_s3,
    store_document_vectors,
    get_conversational_chain,
    embeddings,
)
from langchain_core.documents import Document

chatRouter = APIRouter()

class LLMPrompt(BaseModel):
    query: str
    document_id: str

@chatRouter.post("/upload")
async def upload_pdf(file: UploadFile):
    if not file.filename.endswith(".pdf"):
        return {"message": f"Invalid file type in {file.filename}. Only PDF files are allowed."}

    uuid_str = str(uuid.uuid4())
    filename = uuid_str + "_" + file.filename.replace(" ", "_")
    pdf_content = await file.read()
    response = upload_pdf_to_s3(pdf_content, filename)
    store_document_vectors(pdf_content, response["id"])
    await file.close()
    return response

@chatRouter.post("/conversation")
async def process_llm_prompt(conversation: LLMPrompt):
    query = conversation.query
    document_id = conversation.document_id

    chain = get_conversational_chain()
    
    query_vector = embeddings.embed_query(query)
    try:
        docs = supabase.rpc(
            "search_by_document_id", 
            {
                "doc_id": document_id, 
                "query_vector": query_vector
            }
        ).execute()
        
        if 'error' in docs and docs['error']:
            raise HTTPException(status_code=500, detail=docs['error']['message'])
        
        input_documents = []
        for doc in (docs.model_dump()["data"]):
            metadata = json.loads(doc['metadata'])
            document = Document(page_content=metadata['page_content'], metadata=metadata['metadata'])
            input_documents.append(document)

        query_response = chain.invoke({"input_documents": input_documents, "question": query})
        return query_response
        
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
