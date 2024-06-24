import os
import uvicorn
from fastapi import FastAPI
from config import config
from repository.schema import Base
from repository.schema.user import User  # noqa
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url='/api/docs' if not config['PROD'] else None,
              redoc_url='/api/redoc' if not config['PROD'] else None,
              openapi_url='/api/openapi.json' if not config['PROD'] else None)

for file in os.listdir("routes"):
    if not file.startswith('_'):
        module_name, _ = os.path.splitext(file)
        module = __import__(f"routes.{module_name}", fromlist=[module_name])
        app.include_router(module.router, prefix=f"/api/{module_name}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    configs = {
        'host': config['HOST'],
        'port': config['PORT'],
        'reload': not config['PROD'],
        'workers': config['workers'] if config['PROD'] else 1
    }
    Base.metadata.create_all(bind=create_engine(config['DATABASE_URL']))
    uvicorn.run("app:app", **configs)

__all__ = ["app"]