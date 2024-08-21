# PDFlow

## Overview

This project is a demonstration of a chat application integrated with PDF processing capabilities. It utilizes FastAPI as the backend framework, Langchain for natural language processing, Pinecone for vector database storage, AWS S3 for file storage, and Next.js for the frontend.

## Documentation

### Setup Instructions

1. Clone the repository:
2. `git clone https://github.com/sd1p/aiplanet.git`
3. Install dependencies for both backend and frontend:
4. `cd backend`
5. `pip install -r requirements.txt`
6. `cd ../frontend`
7. `npm install`
8. Configure environment variables:
   - Create a `.env` file in the backend directory and set the required variables.

        ```env
        OPENAI_API_KEY=
        PINECONE_API_KEY=
        PINECONE_INDEX_NAME=
        AWS_ACCESS_KEY_ID=
        AWS_SECRET_ACCESS_KEY=
        AWS_REGION= 
        AWS_BUCKET_NAME=
        APP_FRONTEND_URL=
        ```

   - Create a `.env.local` file in the frontend directory and set the required variables.

        ```env
        NEXT_PUBLIC_BACKEND_URI=
        ```

9. Run the backend server:
10. `cd backend`
11. `uvicorn main:app --reload --port 8000`
12. Run the frontend application:
13. `cd frontend`
14. `npm run dev`
15. Run the app at `http://localhost:3000/`

### API Documentation

#### Deployment Endpoint - `https://aiplanet-qp6q.onrender.com`

#### `/api/upload`

- **Method:** POST
- **Description:** Uploads a PDF file to the server.
- **Parameters:**
- `file` (multipart/form-data): The PDF file to upload.
- **Response:**
- `response` (json) : Contains `fileName`, `namespace`, `URI`
  
  ```json
    {
        "fileName": "",
        "namespace": "",
        "URI": ""
    }
  ```

#### `/api/conversation`

- **Method:** POST
- **Description:** Initiates a conversation with the provided PDF document.
- **Parameters:**
- `namespace` (str): The unique identifier of the uploaded PDF document.
- `query` (str): The question to ask regarding the document.
- **Response:**
- `response` (json): Contains `input_documents`, `output_text`, `question`
  
  ```json
  {
    "input_documents":[],
    "output_text": "",
    "question": ""
  }
  ```

### Application Architecture

The application follows a client-server architecture. The backend server is implemented using FastAPI, which handles API requests from the frontend. Langchain is integrated into the backend to process natural language queries and retrieve relevant information from the PDF documents stored in the Pinecone vector database. AWS S3 is used for storing PDF files uploaded by users. The frontend is built using Next.js, providing a user-friendly interface for interacting with the application.

[![Application Architecture](https://i.postimg.cc/MKjcSJT9/pdflow3.png)](https://i.postimg.cc/MKjcSJT9/pdflow3.png)

## Demo

A live demo of the application can be accessed [here](https://drive.google.com/file/d/1BsXxbTly-duj3FzifwMqZWOcROG4q3CJ/view?usp=sharing).

https://github.com/sd1p/aiplanet/assets/43758514/c0420af1-2029-45e6-abbf-7a538043c2a4

