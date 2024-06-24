from fastapi.testclient import TestClient
from unittest import TestCase
from app import app

client = TestClient(app)

class TestDemo(TestCase):
    def test_demo(self):
        response = client.get("/api/demo/hello")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello, World!"})