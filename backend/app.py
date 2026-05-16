"""

LeetCode Tracker API - A RESTful API for tracking LeetCode problem-solving progress.

In this API, we'll manage different requests sent from the frontend.
MVP features:

Problem Management:
    - Add a new problem to the database.   
    - Retrieve a list of all problems.
    - Update the status of a problem (e.g., mark as solved).
    - Delete a problem from the database.

Module uses FastAPI and SQLAlchemy for database interactions with PostgreSQL.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, Base, engine
from model import Problem
from schemas import ProblemCreate, ProblemUpdate, ProblemDelete, ProblemResponse
from typing import List, Optional
import os


# Create the database tables
Base.metadata.create_all(bind=engine)

# Start the FastAPI application
app = FastAPI()

# Set up CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""

Problem Management Endpoints

"""

# Create a new problem
@app.post("/problems/", response_model=ProblemResponse)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    db_problem = Problem(**problem.model_dump())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

# Get all problems
@app.get("/problems/", response_model=List[ProblemResponse])
def read_problems(title: Optional[str] = None, topic: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(Problem)
    if title:
        query = query.filter(Problem.title.ilike(f"%{title}%"))
    if topic:
        query = query.filter(Problem.topic == topic)
    
    problems = query.offset(skip).limit(limit).all()
    return problems

# Delete a problem
@app.delete("/problems/", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(problem: ProblemDelete, db: Session = Depends(get_db)):
    db_problem = db.query(Problem).filter(Problem.title == problem.title).first()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(db_problem)
    db.commit()
    return 

# Update a Problem
@app.put("/problems/", response_model=ProblemResponse)
def update_problem(problem : ProblemUpdate, db : Session = Depends(get_db)):
    db_problem = db.query(Problem).filter(Problem.title == problem.title).first()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Update only the existing/provided attributes in db_problem

    for key, value in problem.model_dump(exclude_unset=True).items():
        setattr(db_problem, key, value)
    
    db.commit()
    db.refresh(db_problem)

    return db_problem
