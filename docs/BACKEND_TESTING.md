# Backend Testing

Tests are run with pytest against an in-memory SQLite database (via SQLAlchemy's `StaticPool`). Each test gets a clean database created before it and dropped after. Run from the `backend/` directory:

```bash
pytest tests/ -v
```

---

## Bugs Fixed During Testing

| File | Bug | Fix |
|------|-----|-----|
| `schemas.py:10` | `DifficultyLevel` inherited from SQLAlchemy's `Enum` (a TypeEngine), making it non-iterable and non-functional as a Python enum | Changed to `from enum import Enum` |
| `model.py:31` | `Column(DifficultyLevel, ...)` passed a Python enum class directly to SQLAlchemy — only TypeEngine instances are valid | Changed to `Column(String, ...)` |
| `app.py:51` | `model_dump()` returns `Url` and enum member objects that sqlite3/psycopg2 can't bind | Changed to `model_dump(mode='json')` in both create and update handlers |
| `app.py:52` | No `IntegrityError` handling — duplicate title or URL silently returned 500 | Added explicit 409 response |

---

## Test Reference

### `test_problems.py`

#### Create Problem — `POST /problems/`

| Test | What it checks | Why |
|------|---------------|-----|
| `test_create_valid` | A well-formed POST returns 200 with all fields in the response | Baseline: confirms the happy path works end-to-end |
| `test_create_optional_fields_absent` | Omitting `dateSolved` and `notes` still returns 200; those fields are null in the response | Confirms nullable fields don't block creation |
| `test_create_missing_title` | Omitting `title` returns 422 | `title` is required; Pydantic should reject the request before it hits the DB |
| `test_create_missing_difficulty` | Omitting `difficulty` returns 422 | Same as above |
| `test_create_missing_topic` | Omitting `topic` returns 422 | Same as above |
| `test_create_missing_description` | Omitting `description` returns 422 | Same as above |
| `test_create_missing_url` | Omitting `url` returns 422 | Same as above |
| `test_create_invalid_difficulty` | Sending `difficulty: "Legendary"` returns 422 | Only "Easy", "Medium", "Hard" are valid; anything else should be rejected at validation |
| `test_create_invalid_url` | Sending `url: "not-a-url"` returns 422 | Pydantic's `HttpUrl` must reject non-URL strings |
| `test_create_duplicate_title` | Inserting the same title twice returns 409 | The `title` column has a unique constraint; the API should surface this as a conflict, not a 500 |
| `test_create_duplicate_url` | Inserting the same URL twice (different title) returns 409 | The `url` column also has a unique constraint; same reasoning |

#### Get Problems — `GET /problems/`

| Test | What it checks | Why |
|------|---------------|-----|
| `test_get_empty_db` | GET on an empty database returns 200 with an empty list | The endpoint must handle no data gracefully |
| `test_get_all` | After inserting two problems, GET returns both | Basic retrieval works |
| `test_filter_by_title` | `?title=Two Sum` returns only the matching problem | Title filter returns the right record |
| `test_filter_by_title_case_insensitive` | `?title=two sum` (lowercase) still matches | The filter uses `ilike`, so casing must not matter |
| `test_filter_by_title_partial_match` | `?title=Sum` matches a title that contains "Sum" | The filter is a substring match, not an exact match |
| `test_filter_by_topic` | `?topic=Array` returns only Array problems | Topic filter works and excludes non-matching records |
| `test_filter_no_match` | `?title=Nonexistent XYZ` returns an empty list | A filter with no matches should return `[]`, not an error |
| `test_pagination_skip` | `?skip=1` on 3 problems returns 2 | `skip` correctly offsets the result set |
| `test_pagination_limit` | `?limit=2` on 3 problems returns 2 | `limit` correctly caps the result set |
| `test_pagination_skip_and_limit` | `?skip=1&limit=1` on 3 problems returns 1 | Both parameters work in combination |

#### Delete Problem — `DELETE /problems/`

| Test | What it checks | Why |
|------|---------------|-----|
| `test_delete_existing` | Deleting a known problem returns 204 | Basic delete success path |
| `test_delete_not_found` | Deleting a non-existent title returns 404 | The API must report missing resources, not silently succeed |
| `test_delete_removes_from_db` | After deleting, a GET for the same title returns nothing | Confirms the record is actually gone, not just the response code |

#### Update Problem — `PUT /problems/`

| Test | What it checks | Why |
|------|---------------|-----|
| `test_update_notes` | Updating `notes` returns 200 with the new value | Basic update success path |
| `test_update_not_found` | Updating a non-existent title returns 404 | The API must reject updates on unknown problems |
| `test_update_partial_leaves_other_fields_unchanged` | Sending only `notes` does not alter `difficulty`, `topic`, etc. | `exclude_unset=True` ensures partial updates don't overwrite fields with null |
| `test_update_difficulty` | Changing `difficulty` to a new valid value is reflected in the response | Mutable fields can actually be changed |
| `test_update_invalid_difficulty` | Sending `difficulty: "Legendary"` returns 422 | Enum validation must apply on updates, not just creation |

---

### `test_stats.py`

#### Statistics — `GET /problems/stats`

| Test | What it checks | Why |
|------|---------------|-----|
| `test_empty_db` | Stats on an empty database returns zeros for all difficulties and an empty topic map | The endpoint must handle no data without errors |
| `test_total_count` | `totalProblems` matches the number of inserted problems | The count must be accurate |
| `test_difficulty_breakdown_accurate` | Each difficulty bucket shows the correct count after inserting one Easy, one Medium, one Hard | The per-difficulty aggregation is correct |
| `test_all_difficulty_levels_present_even_when_zero` | All three difficulty keys appear in the response even when only Easy problems exist | The response shape must be consistent regardless of data; consumers should not have to guard for missing keys |
| `test_topic_breakdown_accurate` | Each topic bucket shows the correct count | The per-topic aggregation is correct |
| `test_filter_by_topic` | `?topic=Array` scopes the stats to Array problems only | The topic filter narrows all three stat dimensions, not just the total |
| `test_filter_by_topic_no_match` | `?topic=Graph` with no Graph problems returns zero total and empty topic map | A filter with no match should return valid zeroed stats |
| `test_filter_by_start_date` | `?start_date=2024-03-01` excludes problems solved before that date | Start-date boundary is inclusive and correctly applied |
| `test_filter_by_end_date` | `?end_date=2024-03-10` excludes problems solved after that date | End-date boundary is inclusive and correctly applied |
| `test_filter_by_date_range` | `?start_date=2024-02-01&end_date=2024-04-30` returns only problems within the window | Both bounds work together to isolate a date range |
