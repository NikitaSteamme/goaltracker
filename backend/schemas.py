from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class TaskCreate(BaseModel):
    name: str
    result: str
    duration: int
    finish_time: str
    finish_criteria: str
    resources: str