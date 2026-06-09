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
from sqlalchemy.exc import IntegrityError
from database import get_db, Base, engine
from model import Problem
from schemas import ProblemCreate, ProblemUpdate, ProblemDelete, ProblemResponse, StatsResponse, DifficultyLevel
from typing import List, Optional
from datetime import date
import os


# Create the database tables
Base.metadata.create_all(bind=engine)

# Start the FastAPI application
app = FastAPI()

# Set up CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server default
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    # Covers production + all Vercel preview URLs (branch and deployment previews)
    allow_origin_regex=r"https://leet-code-tracker[\w-]*\.vercel\.app",
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
    # mode='json' converts HttpUrl → str and enum members → their values
    db_problem = Problem(**problem.model_dump(mode='json'))
    db.add(db_problem)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A problem with this title or URL already exists")
    db.refresh(db_problem)
    return db_problem

# Get all problems
@app.get("/problems/", response_model=List[ProblemResponse])
def read_problems(title: Optional[str] = None, topic: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(Problem)
    if title:
        query = query.filter(Problem.title.ilike(f"%{title}%"))
    if topic:
        query = query.filter(Problem.topic.ilike(f"%{topic}%"))
    
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

    for key, value in problem.model_dump(mode='json', exclude_unset=True).items():
        setattr(db_problem, key, value)
    
    db.commit()
    db.refresh(db_problem)

    return db_problem

# Get problem statistics
@app.get("/problems/stats", response_model=StatsResponse)
def get_stats(
    topic: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Problem)
    if topic:
        query = query.filter(Problem.topic == topic)
    if start_date:
        query = query.filter(Problem.dateSolved >= str(start_date))
    if end_date:
        query = query.filter(Problem.dateSolved <= str(end_date))

    problems = query.all()

    # Pre-populate all difficulty levels with 0 so missing ones still appear in the response
    by_difficulty = {level.value: 0 for level in DifficultyLevel}
    by_topic: dict = {}
    for p in problems:
        # dateSolved is stored as a string in the DB, so date comparisons above are lexicographic (safe for ISO format)
        by_difficulty[p.difficulty] += 1
        if p.topic not in by_topic:
            # Pre-populate all difficulty levels per topic so the frontend always gets a consistent shape
            by_topic[p.topic] = {level.value: 0 for level in DifficultyLevel}
        by_topic[p.topic][p.difficulty] += 1

    return StatsResponse(
        totalProblems=len(problems),
        problemsByDifficulty=by_difficulty,
        problemsByTopic=by_topic,
    )
