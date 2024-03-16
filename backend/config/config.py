import os
import boto3
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Get environment variables for Pinecone
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# Get environment variables for AWS
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

# Get environment variable for OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Get environment variable for the frontend URL 
APP_FRONTEND_URL = os.getenv("APP_FRONTEND_URL")

# Initialize Pinecone with the API key
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create a Pinecone index with the specified name
index = pc.Index(PINECONE_INDEX_NAME)

# Create a boto3 session with the specified AWS credentials and region
session = boto3.Session(
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
)

# Initialize OpenAI embeddings
embeddings = OpenAIEmbeddings()