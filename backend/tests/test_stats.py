from data import PROBLEM_EASY, PROBLEM_MEDIUM, PROBLEM_HARD


class TestStats:
    def test_empty_db(self, client):
        response = client.get("/problems/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["totalProblems"] == 0
        assert data["problemsByDifficulty"] == {"Easy": 0, "Medium": 0, "Hard": 0}
        assert data["problemsByTopic"] == {}

    def test_total_count(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        data = client.get("/problems/stats").json()
        assert data["totalProblems"] == 2

    def test_difficulty_breakdown_accurate(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        client.post("/problems/", json=PROBLEM_HARD)
        data = client.get("/problems/stats").json()
        assert data["problemsByDifficulty"]["Easy"] == 1
        assert data["problemsByDifficulty"]["Medium"] == 1
        assert data["problemsByDifficulty"]["Hard"] == 1

    def test_all_difficulty_levels_present_even_when_zero(self, client):
        # Only adding an Easy problem; Medium and Hard should still appear with 0
        client.post("/problems/", json=PROBLEM_EASY)
        data = client.get("/problems/stats").json()
        assert "Easy" in data["problemsByDifficulty"]
        assert "Medium" in data["problemsByDifficulty"]
        assert "Hard" in data["problemsByDifficulty"]
        assert data["problemsByDifficulty"]["Medium"] == 0
        assert data["problemsByDifficulty"]["Hard"] == 0

    def test_topic_breakdown_accurate(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        client.post("/problems/", json=PROBLEM_MEDIUM)
        client.post("/problems/", json=PROBLEM_HARD)
        data = client.get("/problems/stats").json()
        assert data["problemsByTopic"]["Array"] == 1
        assert data["problemsByTopic"]["Dynamic Programming"] == 1
        assert data["problemsByTopic"]["Linked List"] == 1

    def test_filter_by_topic(self, client):
        client.post("/problems/", json=PROBLEM_EASY)    # Array
        client.post("/problems/", json=PROBLEM_MEDIUM)  # Dynamic Programming
        data = client.get("/problems/stats?topic=Array").json()
        assert data["totalProblems"] == 1
        assert data["problemsByDifficulty"]["Easy"] == 1
        assert data["problemsByDifficulty"]["Medium"] == 0

    def test_filter_by_topic_no_match(self, client):
        client.post("/problems/", json=PROBLEM_EASY)
        data = client.get("/problems/stats?topic=Graph").json()
        assert data["totalProblems"] == 0
        assert data["problemsByTopic"] == {}

    def test_filter_by_start_date(self, client):
        client.post("/problems/", json=PROBLEM_EASY)    # 2024-01-15
        client.post("/problems/", json=PROBLEM_MEDIUM)  # 2024-03-10
        client.post("/problems/", json=PROBLEM_HARD)    # 2024-06-01
        # start_date=2024-03-01 should exclude the Easy problem (Jan)
        data = client.get("/problems/stats?start_date=2024-03-01").json()
        assert data["totalProblems"] == 2

    def test_filter_by_end_date(self, client):
        client.post("/problems/", json=PROBLEM_EASY)    # 2024-01-15
        client.post("/problems/", json=PROBLEM_MEDIUM)  # 2024-03-10
        client.post("/problems/", json=PROBLEM_HARD)    # 2024-06-01
        # end_date=2024-03-10 should exclude the Hard problem (June)
        data = client.get("/problems/stats?end_date=2024-03-10").json()
        assert data["totalProblems"] == 2

    def test_filter_by_date_range(self, client):
        client.post("/problems/", json=PROBLEM_EASY)    # 2024-01-15
        client.post("/problems/", json=PROBLEM_MEDIUM)  # 2024-03-10
        client.post("/problems/", json=PROBLEM_HARD)    # 2024-06-01
        # Range 2024-02-01 to 2024-04-30 should include only Medium
        data = client.get("/problems/stats?start_date=2024-02-01&end_date=2024-04-30").json()
        assert data["totalProblems"] == 1
        assert data["problemsByDifficulty"]["Medium"] == 1
        assert data["problemsByDifficulty"]["Easy"] == 0
        assert data["problemsByDifficulty"]["Hard"] == 0
