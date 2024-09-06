import uuid
import json
from datetime import datetime,timezone


class Document:
    def __init__(self,filename,s3_url,created_at=None) -> None:
        self.id = uuid.uuid4() 
        self.filename = filename 
        self.s3_url = s3_url
        self.created_at = created_at or datetime.now(timezone.utc)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "filename": self.filename,
            "s3_url": self.s3_url,
            "created_at": self.created_at.isoformat()
        }
        
    @staticmethod
    def from_dict(data):
        return Document(
            filename = data["filename"],
            s3_url = data["s3_url"],
            created_at = datetime.fromisoformat(data["created_at"])
        )

    

class DocumentVector:
    def __init__(self, document_id, vector, metadata=None, created_at=None):
        self.id = uuid.uuid4() 
        self.document_id = document_id
        self.vector = vector
        self.metadata = metadata or {}
        self.created_at = created_at or datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "id": str(self.id),
            "document_id": str(self.document_id),
            "vector": self.vector,
            "metadata": json.dumps(self.metadata),  
            "created_at": self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return DocumentVector(
            document_id=data["document_id"],
            vector=data["vector"],
            metadata=json.loads(data["metadata"]),
            created_at=datetime.fromisoformat(data["created_at"])
        )


