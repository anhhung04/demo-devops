FROM python:3.11.7-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    musl-dev \
    libffi-dev \
    libssl-dev \
    libpq-dev \
    tk \    
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ./src .

CMD ["python3", "app.py"]