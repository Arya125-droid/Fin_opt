from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import InputData
from optimizer import optimize_portfolio

app = FastAPI()

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.post("/optimize")
def optimize(data: InputData):
    return optimize_portfolio(data)