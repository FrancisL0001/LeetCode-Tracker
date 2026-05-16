from data import PROBLEM_EASY, PROBLEM_MEDIUM, PROBLEM_HARD


def delete(client, title: str):
    return client.request("DELETE", "/problems/", json={"title": title})


class TestCreateProblem:
    def test_create_valid(self, client):
        response = client.post("/problems/", json=PROBLEM_EASY)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == PROBLEM_EASY["title"]
        assert data["difficulty"] == PROBLEM_EASY["difficulty"]
        assert data["topic"] == PROBLEM_EASY["topic"]
        assert data["description"] == PROBLEM_EASY["description"]
        assert "id" in data

    def test_create_optional_fields_absent(self, client):
        # dateSolved and notes are nullable; solution is NOT NULL in the model
        # so it must always be provided (known schema inconsistency)
        payload = {k: v for k, v in PROBLEM_EASY.items() if k not in ("dateSolved", "notes")}
        response = client.post("/problems/", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["dateSolved"] is None
        assert data["notes"] is None

    def test_create_missing_title(self, client):
        payload = {k: v for k, v in PROBLEM_EASY.items() if k != "title"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_missing_difficulty(self, client):
        payload = {k: v for k, v in PROBLEM_EASY.items() if k != "difficulty"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_missing_topic(self, client):
        payload = {k: v for k, v in PROBLEM_EASY.items() if k != "topic"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_missing_description(self, client):
        payload = {k: v for k, v in PROBLEM_EASY.items() if k != "description"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_missing_url(self, client):
        payload = {k: v for k, v in PROBLEM_EASY.items() if k != "url"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_invalid_difficulty(self, client):
        payload = {**PROBLEM_EASY, "difficulty": "Legendary"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_invalid_url(self, client):
        payload = {**PROBLEM_EASY, "url": "not-a-url"}
        assert client.post("/problems/", json=payload).status_code == 422

    def test_create_duplicate_title(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        duplicate = {**PROBLEM_EASY, "url": "https://leetcode.com/problems/two-sum-v2/"}
        assert client.post("/problems/", json=duplicate).status_code == 409

    def test_create_duplicate_url(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        duplicate = {**PROBLEM_EASY, "title": "Two Sum V2"}
        assert client.post("/problems/", json=duplicate).status_code == 409


class TestGetProblems:
    def test_get_empty_db(self, client):
        response = client.get("/problems/")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_all(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        response = client.get("/problems/")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_filter_by_title(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        data = client.get("/problems/?title=Two Sum").json()
        assert len(data) == 1
        assert data[0]["title"] == "Two Sum"

    def test_filter_by_title_case_insensitive(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        data = client.get("/problems/?title=two sum").json()
        assert len(data) == 1

    def test_filter_by_title_partial_match(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        # "Sum" appears in "Two Sum" only
        data = client.get("/problems/?title=Sum").json()
        assert len(data) == 1

    def test_filter_by_topic(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        data = client.get("/problems/?topic=Array").json()
        assert len(data) == 1
        assert data[0]["topic"] == "Array"

    def test_filter_no_match(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        data = client.get("/problems/?title=Nonexistent XYZ").json()
        assert data == []

    def test_pagination_skip(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        client.post("/problems/", json=PROBLEM_HARD)
        data = client.get("/problems/?skip=1").json()
        assert len(data) == 2

    def test_pagination_limit(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        client.post("/problems/", json=PROBLEM_HARD)
        data = client.get("/problems/?limit=2").json()
        assert len(data) == 2

    def test_pagination_skip_and_limit(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        client.post("/problems/", json=PROBLEM_HARD)
        data = client.get("/problems/?skip=1&limit=1").json()
        assert len(data) == 1


class TestDeleteProblem:
    def test_delete_existing(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        response = delete(client, "Two Sum")
        assert response.status_code == 204

    def test_delete_not_found(self, client):
        response = delete(client, "Nonexistent")
        assert response.status_code == 404

    def test_delete_removes_from_db(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        delete(client, "Two Sum")
        remaining = client.get("/problems/?title=Two Sum").json()
        assert remaining == []


class TestUpdateProblem:
    def test_update_notes(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        response = client.put("/problems/", json={"title": "Two Sum", "notes": "Updated notes"})
        assert response.status_code == 200
        assert response.json()["notes"] == "Updated notes"

    def test_update_not_found(self, client):
        response = client.put("/problems/", json={"title": "Nonexistent", "notes": "x"})
        assert response.status_code == 404

    def test_update_partial_leaves_other_fields_unchanged(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        response = client.put("/problems/", json={"title": "Two Sum", "notes": "New notes"})
        assert response.status_code == 200
        data = response.json()
        assert data["notes"] == "New notes"
        assert data["difficulty"] == PROBLEM_EASY["difficulty"]
        assert data["topic"] == PROBLEM_EASY["topic"]

    def test_update_difficulty(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        response = client.put("/problems/", json={"title": "Two Sum", "difficulty": "Medium"})
        assert response.status_code == 200
        assert response.json()["difficulty"] == "Medium"

    def test_update_invalid_difficulty(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        response = client.put("/problems/", json={"title": "Two Sum", "difficulty": "Legendary"})
        assert response.status_code == 422
