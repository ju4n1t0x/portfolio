import pytest
from fastapi.testclient import TestClient
from app.main import app
class TestMain:
    client = TestClient(app)
    def setup_function(self):
        pass
    def test_read_main(self):
        response = self.client.post(
            '/agentJuani',
            json={"message": "cuales son las experiencias laborales de juan?"}
        )
        assert response.status_code == 200
        chunks = []
        for line in response.iter_lines():
            if line.startswith("data: "):
                chunks.append(line[6:])
        full_text = "".join(chunks)
        assert len(full_text) > 0, "La respuesta no puede estar vacía"
        assert isinstance(full_text, str)
        print(f"Respuesta: {full_text}")