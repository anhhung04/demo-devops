from fastapi.responses import JSONResponse, PlainTextResponse


class APIResponse:
    @staticmethod
    def as_json(code: int, status: str, data: dict = {}) -> JSONResponse:
        content = {
            "code": code,
            "status": status,
        }
        if data:
            content.update({"data": data})
        return JSONResponse(status_code=code, content=content)

    @staticmethod
    def as_text(code: int, message: str) -> PlainTextResponse:
        return PlainTextResponse(status_code=code, content=message)
