"""

Pydantic schemas for request and response validation.

"""

from pydantic import BaseModel, HttpUrl, field_validator
from datetime import date
from sqlalchemy import Enum

class DifficultyLevel(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

# Base Schema for Creating a Problem
class ProblemCreate(BaseModel):
    title: str
    difficulty: DifficultyLevel
    description: str
    url: HttpUrl
    dateSolved: date | None = None
    solution: str | None = None
    notes: str | None = None

# Schema for Updating a Problem
class ProblemUpdate(BaseModel):
    difficulty: DifficultyLevel | None = None
    description: str | None = None
    url: HttpUrl | None = None
    dateSolved: date | None = None
    solution: str | None = None
    notes: str | None = None

# Schema for deleting a Problem
class ProblemDelete(BaseModel):
    title: str

