"""

Pydantic schemas for request and response validation.

"""

from pydantic import BaseModel, HttpUrl, field_validator
from datetime import date
from enum import Enum
from typing import Optional

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

# Base Schema for Creating a Problem
class ProblemCreate(BaseModel):
    title: str
    difficulty: DifficultyLevel
    topic : str
    description: str
    url: HttpUrl
    dateSolved: Optional[date] = None
    solution: Optional[str] = None
    notes: Optional[str] = None

# Schema for Updating a Problem
class ProblemUpdate(BaseModel):
    title : str
    difficulty: Optional[DifficultyLevel] = None
    topic : Optional[str] = None
    description: Optional[str] = None
    url: Optional[HttpUrl] = None
    dateSolved: Optional[date] = None
    solution: Optional[str] = None
    notes: Optional[str] = None

# Schema for deleting a Problem
class ProblemDelete(BaseModel):
    title: str

# Schema for Response
class ProblemResponse(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: DifficultyLevel
    description: str
    url: HttpUrl
    dateSolved: Optional[date] = None
    solution: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        orm_mode = True

# Schema for Stats Response
class StatsResponse(BaseModel):
    totalProblems: int
    problemsByDifficulty: dict
    problemsByTopic: dict
