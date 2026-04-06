from pydantic import BaseModel

class InputData(BaseModel):
    income: float
    risk: float