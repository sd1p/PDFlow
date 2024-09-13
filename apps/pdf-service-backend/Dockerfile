FROM python:3.9-slim

WORKDIR /app

COPY poetry.lock pyproject.toml /app/

RUN pip install poetry

RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

COPY . /app

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]