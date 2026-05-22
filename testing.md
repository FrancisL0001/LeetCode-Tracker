# Testing Strategy

## CI Regression Gate

The GitHub Actions CI pipeline runs on every push to `main` and every pull request targeting `main`.

Key behaviors and invariants:
- Backend API behavior must remain covered by the pytest suite in `backend/tests/`.
- Frontend rendering, presenter, form, filter, stats, and API behavior must remain covered by the Vitest suite in `frontend/src/__tests__/`.
- The frontend production build must compile successfully before changes are accepted.
- Tests must not require Railway, Vercel, production credentials, or local `.env` files.

Edge cases and failure modes:
- Backend tests use the existing in-memory SQLite fixture so CI does not mutate the deployed PostgreSQL database.
- Frontend tests run before the build so behavior regressions fail early.
- `npm ci` uses `package-lock.json` to avoid dependency drift between local development and CI.

Inputs that must never break the system:
- Empty problem lists.
- Duplicate problem title or URL submissions.
- Missing or invalid problem fields.
- Topic, title, pagination, and date-range filters.
- Production build compilation from a clean checkout.
