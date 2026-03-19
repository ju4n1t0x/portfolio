"""Integration tests for /chat endpoint with section parameter.

Tests:
- Spec scenario: Request with section parameter
- Spec scenario: Request without section parameter (backward compatibility)
- Spec scenario: Request with invalid section (graceful degradation)
"""

from unittest.mock import patch, MagicMock
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Create a test client for the FastAPI app."""
    return TestClient(app)


class TestChatEndpointWithSection:
    """Integration tests for /chat endpoint section parameter handling."""

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_with_about_section(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request with section='about', WHEN posting to /chat, THEN returns 200 and processes with section context."""
        mock_retrieve.return_value = "Some relevant context"
        mock_ollama_chat.return_value = {"message": {"content": "Response about Juan"}}

        response = client.post(
            "/chat",
            json={"message": "Tell me about yourself", "section": "about"},
        )

        assert response.status_code == 200
        assert "response" in response.json()
        
        # Verify ollama was called with section-aware prompt
        call_args = mock_ollama_chat.call_args
        messages = call_args.kwargs["messages"]
        system_prompt = messages[0]["content"]
        assert "About" in system_prompt
        assert "professional profile" in system_prompt

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_with_projects_section(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request with section='projects', WHEN posting to /chat, THEN uses projects-focused prompt."""
        mock_retrieve.return_value = "Project context"
        mock_ollama_chat.return_value = {"message": {"content": "Here are the projects"}}

        response = client.post(
            "/chat",
            json={"message": "What projects have you worked on?", "section": "projects"},
        )

        assert response.status_code == 200
        
        call_args = mock_ollama_chat.call_args
        messages = call_args.kwargs["messages"]
        system_prompt = messages[0]["content"]
        assert "Projects" in system_prompt
        assert "Technical projects" in system_prompt

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_with_experience_section(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request with section='experience', WHEN posting to /chat, THEN uses experience-focused prompt."""
        mock_retrieve.return_value = "Experience context"
        mock_ollama_chat.return_value = {"message": {"content": "Work history response"}}

        response = client.post(
            "/chat",
            json={"message": "What is your work experience?", "section": "experience"},
        )

        assert response.status_code == 200
        
        call_args = mock_ollama_chat.call_args
        messages = call_args.kwargs["messages"]
        system_prompt = messages[0]["content"]
        assert "Experience" in system_prompt
        assert "Work history" in system_prompt

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_without_section_backward_compatible(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request WITHOUT section field, WHEN posting to /chat, THEN returns 200 (backward compatibility)."""
        mock_retrieve.return_value = "General context"
        mock_ollama_chat.return_value = {"message": {"content": "General response"}}

        response = client.post(
            "/chat",
            json={"message": "Hello"},
        )

        assert response.status_code == 200
        assert "response" in response.json()
        
        # Verify base prompt is used without section context
        call_args = mock_ollama_chat.call_args
        messages = call_args.kwargs["messages"]
        system_prompt = messages[0]["content"]
        assert "CURRENT CONTEXT:" not in system_prompt

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_with_null_section(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request with section=null, WHEN posting to /chat, THEN uses default behavior."""
        mock_retrieve.return_value = "Context"
        mock_ollama_chat.return_value = {"message": {"content": "Response"}}

        response = client.post(
            "/chat",
            json={"message": "Hi", "section": None},
        )

        assert response.status_code == 200
        
        call_args = mock_ollama_chat.call_args
        messages = call_args.kwargs["messages"]
        system_prompt = messages[0]["content"]
        assert "CURRENT CONTEXT:" not in system_prompt

    def test_chat_with_invalid_section_validation_error(
        self,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request with invalid section value, WHEN posting to /chat, THEN Pydantic returns 422 validation error."""
        # Pydantic Literal type will reject invalid values
        response = client.post(
            "/chat",
            json={"message": "Hello", "section": "invalid-section"},
        )

        # FastAPI/Pydantic returns 422 for validation errors
        assert response.status_code == 422

    @patch("app.client.ollama_local.ollama.chat")
    @patch("app.client.ollama_local.retrieve_relevant_context")
    def test_chat_response_structure(
        self,
        mock_retrieve: MagicMock,
        mock_ollama_chat: MagicMock,
        client: TestClient,
    ) -> None:
        """Verify response structure matches API contract."""
        mock_retrieve.return_value = "Context"
        mock_ollama_chat.return_value = {"message": {"content": "Test response"}}

        response = client.post(
            "/chat",
            json={"message": "Test", "section": "about"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert isinstance(data["response"], str)
        assert data["response"] == "Test response"

    def test_chat_missing_message_returns_422(
        self,
        client: TestClient,
    ) -> None:
        """GIVEN a chat request without message field, WHEN posting to /chat, THEN returns 422."""
        response = client.post(
            "/chat",
            json={"section": "about"},
        )

        assert response.status_code == 422
