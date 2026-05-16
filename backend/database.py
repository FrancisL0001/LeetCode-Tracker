"""

This module contains the database connection and setup for the LeetCode Tracker application. 
We use SQLAlchemy as the ORM to interact with a PostgreSQL database. 
The database will store information about the problems solved by the user, including the title, difficulty, description, URL, date solved, and solution.

"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic import HttpUrl, field_validator
import os
import dotenv

dotenv.load_dotenv()

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")    

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for our models to inherit from
Base = declarative_base()
 
def get_db():
    """
    Dependency that provides a database session to the API endpoints. 
    It ensures that the session is properly closed after the request is processed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()