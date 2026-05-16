"""

This module contains the model description of the database. 

The database is created using SQLAlchemy and PostgreSQL. Here we'll define only define the problem entity using Base from the database.py

MVP features:
- Problem Management:
    - Add a new problem to the database.   
    - Retrieve a list of all problems.
    - Update the status of a problem (e.g., mark as solved).
    - Delete a problem from the database.



"""

from sqlalchemy import Column, Integer, String, Boolean, Enum
from datetime import datetime
from database import Base
from schemas import DifficultyLevel


# Definition of my problem entities for the database
class Problem(Base):

    __tablename__ = 'problems' 
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, unique=True)
    difficulty = Column(DifficultyLevel, nullable=False)
    topic = Column(String, nullable=False)
    description = Column(String, nullable=False)
    url = Column(String, nullable=False, unique=True)
    dateSolved = Column(String, nullable=True)
    solution = Column(String, nullable=False) # solution for the problem, can be a typed explanation or the url to the solution
    notes = Column(String, nullable=True) # Notes on the problem

