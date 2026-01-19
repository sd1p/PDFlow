import os
import boto3
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

APP_FRONTEND_URL = os.getenv("APP_FRONTEND_URL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
