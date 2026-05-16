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

from fastapi import FastAPI, HTTPException
import os
