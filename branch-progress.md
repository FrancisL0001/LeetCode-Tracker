# Branch: feature/progress_over_time

This branch implements the **progress over time** feature — one of the planned stretch goals described in [`docs/PLAN.md`](docs/PLAN.md).

## Goal

Give users a way to see how their LeetCode practice has evolved over time, not just a static count of what they've solved. The main deliverables are:

- Charts showing problems solved per day, week, or month
- Breakdown of that activity by difficulty (Easy / Medium / Hard)
- Date-range filtering so users can zoom into any period

## Scope

- Backend: new query logic and endpoint(s) to aggregate solved counts over time
- Frontend: chart components wired to the new data, integrated into the stats panel or a dedicated view

## Out of scope for this branch

- User authentication (separate future branch)
- LeetCode API integration (separate future branch)
- Tags (separate future branch)
