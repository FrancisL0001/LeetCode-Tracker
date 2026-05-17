# Frontend Testing

Tests are run with Vitest against a jsdom environment. Each test file imports the component or module directly; there is no running server or real network. Run from the `frontend/` directory:

```bash
npm test
```

---

## Test Reference

### `api.test.ts`

`fetch` is stubbed globally with `vi.stubGlobal` before each test so no real HTTP requests are made. A shared `mockFetch` helper constructs a minimal `Response`-shaped object with configurable status.

#### `getProblems`

| Test | What it checks | Why |
|------|---------------|-----|
| `fetches problems without filters` | A bare call hits `/problems/` and returns the response body | Baseline: confirms the happy path works end-to-end |
| `appends title filter to query string` | Passing `{ title: 'Two Sum' }` adds `title=Two+Sum` to the URL | The backend reads filters from query params; they must be serialised correctly |
| `appends topic filter to query string` | Passing `{ topic: 'Array' }` adds `topic=Array` to the URL | Same as above for topic |
| `appends skip and limit to query string` | Both `skip` and `limit` appear in the URL when supplied | Pagination params must be forwarded; `null` values must be excluded |
| `throws on non-ok response` | A 404 response causes the promise to reject with the status code | Callers depend on thrown errors to surface API failures |

#### `createProblem`

| Test | What it checks | Why |
|------|---------------|-----|
| `posts the problem and returns it` | The request uses `POST` and the response is returned unchanged | Basic creation path |
| `throws on conflict (409)` | A 409 response causes rejection | The backend returns 409 on duplicate title or URL; the client must propagate this so the form can display it |

#### `updateProblem`

| Test | What it checks | Why |
|------|---------------|-----|
| `sends PUT with title and update data` | The request uses `PUT`, and the body includes both `title` and the update fields | The backend identifies the record by title in the body, not a URL segment |
| `throws when problem not found` | A 404 response causes rejection | The API returns 404 for unknown titles on update |

#### `deleteProblem`

| Test | What it checks | Why |
|------|---------------|-----|
| `sends DELETE with title in body` | The request uses `DELETE` and the body contains `{ title }` | The backend reads the title from the request body, not a URL param |
| `throws when problem not found` | A 404 response causes rejection | Same as update: unknown titles return 404 |

#### `getStats`

| Test | What it checks | Why |
|------|---------------|-----|
| `fetches stats without filters` | A bare call hits `/problems/stats` and returns the response | Baseline for the stats endpoint |
| `appends topic filter` | Passing `{ topic: 'Array' }` adds `topic=Array` to the URL | Stats can be scoped to a topic |
| `appends date range filters` | Both `start_date` and `end_date` appear in the URL when supplied | Date range filtering must be forwarded as query params |

---

### `ProblemCard.test.tsx`

#### `ProblemCard`

| Test | What it checks | Why |
|------|---------------|-----|
| `renders problem title` | The title is visible in the document | Core content — nothing useful if the title doesn't render |
| `renders difficulty badge` | The difficulty string appears | The badge is conditionally styled; this confirms it renders at all |
| `renders topic` | The topic string appears | Topic is visible metadata on the card |
| `renders description` | The description text appears | Cards show a truncated description |
| `renders LeetCode link with correct href` | The anchor points to the problem's URL | A wrong href would send users to the wrong page |
| `renders dateSolved when present` | The date string appears when dateSolved is set | Optional field that should appear when provided |
| `renders notes when present` | The notes text appears when notes is set | Optional field that should appear when provided |
| `does not render date when dateSolved is null` | The date is absent when dateSolved is null | Null optional fields must not produce empty or broken elements |
| `does not render notes section when notes is null` | The notes section is absent when notes is null | Same as above for notes |
| `renders solution` | The solution text appears on the card | Solution is always present (non-nullable); confirming it renders |
| `calls onEdit with the problem when edit button is clicked` | Clicking the edit button calls `onEdit` with the full problem object | The parent needs the whole problem to pre-fill the edit form |
| `calls onDelete with the title when delete button is clicked` | Clicking the delete button calls `onDelete` with the title string | The API identifies problems by title |

---

### `ProblemForm.test.tsx`

#### Add mode

| Test | What it checks | Why |
|------|---------------|-----|
| `renders title, description, url, difficulty, topic, solution fields` | All six required fields are present | Confirms the full add form renders |
| `renders Add Problem submit button` | The submit button label is "Add Problem" | Distinguishes the add form from the edit form visually |
| `calls onSubmit with form data on submit` | Filling all fields and clicking submit calls `onSubmit` with the typed values, including `solution` | Core flow: form data must reach the caller |
| `calls onCancel when Cancel button is clicked` | Clicking Cancel calls `onCancel` | The modal depends on this to close |
| `shows error message when onSubmit rejects` | A rejected `onSubmit` renders the error string in the form | The form must surface API errors (e.g. 409 duplicate) inline |
| `disables submit button while submitting` | The button is disabled and labelled "Saving…" during a pending submit | Prevents double-submission while a request is in flight |

#### Edit mode

| Test | What it checks | Why |
|------|---------------|-----|
| `renders Save Changes submit button` | The submit button label is "Save Changes" | Confirms the correct mode is active |
| `pre-fills fields with existing problem data` | Difficulty, topic, solution, and notes inputs start with the problem's current values | Users must see current values before editing |
| `does not render title, description, url fields in edit mode` | Title, description, and URL inputs are absent | Those fields are immutable; showing them would be misleading |
| `calls onSubmit with updated values` | Clearing and retyping notes then submitting calls `onSubmit` with the new value | Confirms edits actually reach the caller |

---

### `ProblemList.test.tsx`

#### `ProblemList`

| Test | What it checks | Why |
|------|---------------|-----|
| `shows a loading spinner when loading` | A spinner with `role="status"` is present when `loading` is true | Users need feedback while the list is fetching |
| `shows error message when error is present` | The error string is visible when `error` is non-null | Network or API failures must be surfaced |
| `shows empty state message when no problems` | "No problems found" appears when the list is empty and not loading | An empty response must not look like a loading or error state |
| `renders all problem cards` | Each problem's title appears when the list has items | Basic render correctness |
| `does not show spinner when not loading` | The spinner is absent when `loading` is false | Spinner must not linger after data arrives |
| `does not show error state when error is null` | No error text when `error` is null | Guard against false positives from other text on the page |

---

### `FilterBar.test.tsx`

Tests for typing use `StatefulFilterBar`, a wrapper that holds local state. Without it, `FilterBar` is a controlled component whose value never updates between keystrokes, so `onChange` would only ever receive the last character typed.

#### `FilterBar`

| Test | What it checks | Why |
|------|---------------|-----|
| `renders title search input` | The title search input is present | Basic presence check |
| `renders topic filter input` | The topic filter input is present | Basic presence check |
| `calls onChange with title when user types in search` | Typing accumulates correctly and the last `onChange` call contains the full string | Verifies the controlled input updates propagate through the stateful wrapper |
| `calls onChange with topic when user types topic filter` | Same as above for the topic input | Same reason |
| `shows clear button when filters are active` | The Clear button appears when any filter is set | Users need a one-click way to reset |
| `hides clear button when no filters are active` | The Clear button is absent when both filters are empty | Avoids a visible button that does nothing |
| `calls onChange with empty object when clear is clicked` | Clicking Clear calls `onChange({})` | Callers reset their filter state from this call |
| `pre-fills inputs with current filter values` | Inputs show the values passed in via `filters` prop | Confirms the controlled inputs reflect external state |

---

### `StatsPanel.test.tsx`

Difficulty counts use `getByTestId` instead of a text query because plain numbers (e.g. `3`) could match other text on the page.

#### `StatsPanel`

| Test | What it checks | Why |
|------|---------------|-----|
| `shows a loading spinner when loading` | A spinner with `role="status"` is present when `loading` is true | Consistent loading UX across the app |
| `shows error message when error is present` | The error string is visible when `error` is non-null | Stats failures must be surfaced |
| `renders nothing when stats is null and not loading` | The container is empty when stats have not loaded yet | Avoids a flash of broken layout before the first fetch completes |
| `renders total problem count` | The `totalProblems` number appears | Primary stat on the panel |
| `renders Easy difficulty count` | `data-testid="difficulty-easy"` contains the Easy count | Per-difficulty breakdown must be accurate |
| `renders Medium difficulty count` | `data-testid="difficulty-medium"` contains the Medium count | Same |
| `renders Hard difficulty count` | `data-testid="difficulty-hard"` contains the Hard count | Same |
| `renders top topics` | Topic names from `problemsByTopic` appear | The top-topics list must display |
| `shows at most 5 topics` | A sixth topic is not rendered when more than 5 exist | The list is capped at 5 to keep the panel compact |
| `shows no data message when topic map is empty` | "No data yet" appears when `problemsByTopic` is empty | Empty topic map must not leave a blank panel section |
