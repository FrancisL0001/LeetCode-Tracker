# LeetCode Tracker Plan

## Purpose

At the most basic level, this is a place where I will keep track of the LeetCode problems I have solved. This should help to keep track of progress, what I have learned, and provide an easy quick way to show my progress to others.


## Structure

### 1. MVP


- Difficulty: a simple enum of the difficulty of the problem (Easy, Medium, Hard) 
```typescript
type Difficulty = "Easy" | "Medium" | "Hard";
```

- Problem: This is the most basic unit of the tracker, it will contain the following information:
    - Title: the title of the problem
    - Difficulty: the difficulty of the problem
    - URL: the URL to the problem on LeetCode
    - Date Solved: the date that I solved the problem
    - Solution: a string input of the solution method and a link to my solution (e.g. a GitHub gist, a blog post, etc.)
    - Notes: any notes that I want to keep about the problem (e.g. what I learned, what I struggled with, etc.)

```typescript // will be implemented in python in the actual codebase, but this is the general structure of the Problem interface
interface Problem {
    title: string;
    difficulty: Difficulty;
    description: string; // A brief description of the problem (e.g. "Given an array of integers, return the indices of the two numbers that add up to a specific target.")
    url: string;
    dateSolved: Date;
    solution: string; // This could be a link to a GitHub gist, a blog post, etc.
    notes: string; // Any notes that I want to keep about the problem (e.g. what I learned, what I struggled with, etc.)
}
```
- Problems: This is just a list/array of problems.
- Tracker: This is the main class that will contain the list of problems and any methods to manipulate the list (e.g. add a problem, remove a problem, etc.)

```typescript
class Tracker {
    problems: Problem[];

    constructor() {
        this.problems = [];
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    removeProblem(title: string) {
        this.problems = this.problems.filter(problem => problem.title !== title);
    }

    getProblemsByDifficulty(difficulty: Difficulty): Problem[] {
        return this.problems.filter(problem => problem.difficulty === difficulty);
    }
}
```

- On the frontend, we will have a simple UI to display the problems and allow the user to add/remove problems. We can use a simple form to add a problem, and a list to display the problems. We can also have filters to filter the problems by difficulty.


> Our backend will receive the data in a JSON from the frontend, and we will do operations on the data. We will also have a postgres database implement in sqlalchemy to store the data persistently. The backend will also have an API to allow the frontend to interact with the data (e.g. add a problem, remove a problem, get problems by difficulty, etc.)

### 2. Stretch Goals

- Tags: We can add tags to the problems to help categorize them (e.g. "Array", "Dynamic Programming", "Graph", etc.)
- Progress Tracking: We can add a feature to track progress over time (e.g. how many problems solved per week, how many problems solved by difficulty, etc.)
- User Authentication: We can add user authentication to allow multiple users to use the tracker and keep their data separate.
- LeetCode Integration: We can integrate with the LeetCode API to automatically fetch problem information and update the tracker when a problem is solved on LeetCode.

## Process

Here, we will provide a form to enter the information about the problem on the frontend, then send it through an API call to the backend, at which point will will add the problem to our postgres database and return a message to the frontend to indicate the success of the operation. Then, we will perform various operation on the data in our database(CRUD operations) and return various results to the frontend to display to the user. MVP will be to implement the basic structure of the tracker and the ability to add/remove problems, view problem details, get a list of solved problems(by name/title), change mutable aspects of projects(solution links, solution method, notes, etc), remove added problems; and then we can add additional features as stretch goals.

## API Design

### Endpoints

- `POST /problems`: Add a new problem to the tracker. The request body will contain the problem information (title, difficulty, url, date solved, solution, notes)`
- `DELETE /problems/:title`: Remove a problem from the tracker by title.
- `GET /problems`: Get a list of all problems in the tracker. we will add query parameters to filter the problems by difficulty, date solved, topic, etc.
- `GET /problems/:title`: Get the details of a specific problem by title.
- `PUT /problems/:title`: Update the details of a specific problem by title. The request body will contain the updated problem information (title, difficulty, url, date solved, solution, notes).
- `GET /problems/stats`: Get statistics about the problems in the tracker (e.g. number of problems solved, number of problems by difficulty, etc.). We will also have query parameters to filter the statistics by date range, topic, etc.

### Request/Response Format

### Request Format

- POST /problems
```json
{
    "title": "Problem Title",
    "difficulty": "easy", // Will have to be one of "easy", "medium", or "hard"
    "url": "https://leetcode.com/problems/problem-title", // The URL to the problem on LeetCode
    "dateSolved": "2023-01-01", // The date that the problem was solved, in ISO 8601 format (YYYY-MM-DD)
    "solution": "Solution description or link",
    "notes": "Any additional notes"
}
```

- DELETE /problems/:title
```json
{
  "title": "Problem Title"
}
```

- GET /problems
    - No request body, returns a list of all the problems in the tracker by title
    - ___QUERY PARAMETERS___
        - difficulty: filter the problems by difficulty (e.g. "easy", "medium", "hard")
        - dateSolved: filter the problems by date solved (e.g. "2023-01-01")
        - topic: filter the problems by topic (e.g. "Array", "Dynamic Programming", etc.)
    
- GET /problems/:title
```json
{
  "title": "Problem Title"
}
```

- PUT /problems/:title
```json
{
    "difficulty": "easy", // Optional. Will have to be one of "easy", "medium", or "hard"
    "url": "https://leetcode.com/problems/problem-title", // Optional. The URL to the problem on LeetCode
    "dateSolved": "2023-01-01", // Optional. The date that the problem was solved, in ISO 8601 format (YYYY-MM-DD)
    "solution": "Solution description or link", // Optional. A string input of the solution method and a link to my solution (e.g. a GitHub gist, a blog post, etc.)
    "notes": "Any additional notes" // Optional. Any notes that I want to keep about the problem (e.g. what I learned, what I struggled with, etc.)
}
```

- GET /problems/stats
    - No request body, returns statistics about the problems in the tracker (e.g. number of problems solved, number of problems by difficulty, etc.)
    - ___QUERY PARAMETERS___
        - dateRange: filter the statistics by date range (e.g. "2023-01-01 to 2023-12-31")
        - topic: filter the statistics by topic (e.g. "Array", "Dynamic Programming", etc.)




### Response Format

- GET /problems
```json
{
    "message": "Problem added successfully",
    "problem": [{
        "title": "Problem Title",
        "difficulty": "easy",
        "url": "https://leetcode.com/problems/problem-title",
        "dateSolved": "2023-01-01",
        "solution": "Solution description or link",
        "notes": "Any additional notes"
    },
    {
        "title": "Problem Title 2",
        "difficulty": "medium",
        "url": "https://leetcode.com/problems/problem-title-2",
        "dateSolved": "2023-02-01",
        "solution": "Solution description or link",
        "notes": "Any additional notes"
    }]
}
``` 

- DELETE /problems/:title
```json
{
    "message": "Problem removed successfully",
    "problem": {
        "title": "Problem Title",
        "difficulty": "easy",
        "url": "https://leetcode.com/problems/problem-title",
        "dateSolved": "2023-01-01",
        "solution": "Solution description or link",
        "notes": "Any additional notes"
    }
}
```

- GET /problems/:title
```json
{
    "problem": {
        "title": "Problem Title",
        "difficulty": "easy",
        "url": "https://leetcode.com/problems/problem-title",
        "dateSolved": "2023-01-01",
        "solution": "Solution description or link",
        "notes": "Any additional notes"
    }
}
```

- PUT /problems/:title
```json
{
    "message": "Problem updated successfully",
    "problem": {
        "title": "Problem Title",
        "difficulty": "easy",
        "url": "https://leetcode.com/problems/problem-title",
        "dateSolved": "2023-01-01",
        "solution": "Solution description or link",
        "notes": "Any additional notes"
    }
}
```

- GET /problems/stats
```json
{
    "totalProblems": 100,
    "problemsByDifficulty": {
        "easy": 50,
        "medium": 30,
        "hard": 20
    },
    "problemsByTopic": {
        "Array": 40,
        "Dynamic Programming": 30,
        "Graph": 20,
        "Other": 10
    }
}
```

