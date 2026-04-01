from pydantic import BaseModel


class ErrorResponse(BaseModel):
    detail: str
    status_code: int


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Operation successful"
