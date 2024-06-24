from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
async def index():
    return {"message": "Hello, World!"}