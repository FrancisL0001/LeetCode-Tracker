# General Testing Plan

## Frontend Testing

Tests in the frontend will be performed using Jest and React Testing Library. The tests will cover the following areas:

- Test the rendering of the components to ensure they display the correct information based on the props and state.
- Test the user interactions (e.g. clicking buttons, filling out forms) to ensure they trigger the expected behavior (e.g. adding a problem, removing a problem, filtering problems by difficulty).
- Test the API calls to ensure they are made with the correct parameters and that the responses are handled correctly (e.g. displaying the correct information, showing error messages for failed requests).
- Test the edge cases (e.g. adding a problem with missing fields, filtering problems with no matching results) to ensure the application handles them gracefully (e.g. showing appropriate error messages, displaying a message when there are no problems to display).

## Backend Testing

Tests in the backend will be performed using pytest. The tests will cover the following areas:

### API Testing

- Test the API endpoints to ensure they return the expected responses for valid and invalid requests.
- Validate the requests 
- Ensure required fields are present and correctly formatted for POST and PUT requests.
- Test the filtering functionality of the GET /problems endpoint with various query parameters.
- Ensure valid responses on GET and DELETE requests for existing and non-existing problems as well as on empty database.
- Validate the problem url to ensure it is a valid LeetCode problem url and that the problem exists on LeetCode.
- Ensure delete removes the problem from the database and that the problem is no longer retrievable after deletion.
- Getting problem statistics should return appropriate statistics on empty database and on a database with problems. The statistics should be accurate based on the problems in the database.

Most of these tests will be performed using a test database to ensure that the tests do not affect the production database. We will use fixtures to set up and tear down the test database before and after each test. We will also use mock data to test the API endpoints without relying on actual data in the database. This will allow us to test various scenarios and edge cases without having to manually add and remove data from the database.

### Database Testing

## Additional Behaviors to Test (identified during implementation)

### Duplicate problem submissions
- Submitting a problem with the same title as an existing problem must return 409.
- Submitting a problem with the same URL as an existing problem (different title) must return 409.

### Pagination on GET /problems/
- `skip` parameter correctly offsets results.
- `limit` parameter correctly caps results.
- Combined `skip` + `limit` behaves correctly.

### Stats endpoint filters
- `GET /problems/stats?topic=...` returns statistics scoped to that topic only.
- `GET /problems/stats?start_date=YYYY-MM-DD` excludes problems solved before that date.
- `GET /problems/stats?end_date=YYYY-MM-DD` excludes problems solved after that date.
- `GET /problems/stats?start_date=...&end_date=...` returns statistics for the range only.

## Known gaps (out of scope for current test pass)
- `GET /problems/` does not support filtering by `difficulty` despite the plan specifying it.
- URL validation only checks that the value is a valid HTTP URL; LeetCode-specific validation is not implemented.
- `solution` is `NOT NULL` in the model but `Optional` in the `ProblemCreate` schema — omitting it would cause a DB-level error rather than a validation error.
