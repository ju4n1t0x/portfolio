"""Unit tests for build_system_prompt function.

Tests all section values to verify correct prompt composition:
- Spec scenario: About section prompt
- Spec scenario: Projects section prompt
- Spec scenario: Experience section prompt
- Spec scenario: No section defaults to general behavior
"""

import pytest
from app.client.ollama_local import (
    build_system_prompt,
    SYSTEM_PROMPT,
    SECTION_PROMPTS,
)


class TestBuildSystemPrompt:
    """Tests for build_system_prompt() function."""

    def test_no_section_returns_base_prompt(self) -> None:
        """GIVEN no section, WHEN calling build_system_prompt, THEN returns base prompt only."""
        result = build_system_prompt(None)
        assert result == SYSTEM_PROMPT
        assert "CURRENT CONTEXT:" not in result

    def test_about_section_includes_about_context(self) -> None:
        """GIVEN section='about', WHEN calling build_system_prompt, THEN includes about-specific context."""
        result = build_system_prompt("about")
        
        assert SYSTEM_PROMPT in result
        assert "CURRENT CONTEXT:" in result
        assert "About" in result
        assert "professional profile and background" in result
        assert "Personal values" in result

    def test_projects_section_includes_projects_context(self) -> None:
        """GIVEN section='projects', WHEN calling build_system_prompt, THEN includes projects-specific context."""
        result = build_system_prompt("projects")
        
        assert SYSTEM_PROMPT in result
        assert "CURRENT CONTEXT:" in result
        assert "Projects" in result
        assert "Technical projects" in result
        assert "Technologies, frameworks" in result

    def test_experience_section_includes_experience_context(self) -> None:
        """GIVEN section='experience', WHEN calling build_system_prompt, THEN includes experience-specific context."""
        result = build_system_prompt("experience")
        
        assert SYSTEM_PROMPT in result
        assert "CURRENT CONTEXT:" in result
        assert "Experience" in result
        assert "Work history" in result
        assert "Career progression" in result

    def test_invalid_section_returns_base_prompt(self) -> None:
        """GIVEN an invalid section value, WHEN calling build_system_prompt, THEN gracefully returns base prompt."""
        result = build_system_prompt("invalid-section")
        
        # Should fallback to base prompt (no section context found)
        assert result == SYSTEM_PROMPT
        assert "CURRENT CONTEXT:" not in result

    def test_contact_section_not_in_section_prompts(self) -> None:
        """GIVEN section='contact', WHEN calling build_system_prompt, THEN returns base prompt (contact disabled on frontend)."""
        # Contact section is disabled on frontend, but if somehow called,
        # it should gracefully return base prompt
        result = build_system_prompt("contact")
        
        # Contact is not in SECTION_PROMPTS, so base prompt only
        assert result == SYSTEM_PROMPT
        assert "CURRENT CONTEXT:" not in result

    @pytest.mark.parametrize("section", ["about", "projects", "experience"])
    def test_all_valid_sections_contain_base_prompt(self, section: str) -> None:
        """GIVEN any valid section, WHEN calling build_system_prompt, THEN always includes base prompt."""
        result = build_system_prompt(section)
        
        assert SYSTEM_PROMPT in result
        assert "Juan Ignacio" in result
        assert "IMPORTANT RESTRICTIONS" in result

    def test_section_prompts_dict_has_expected_keys(self) -> None:
        """Verify SECTION_PROMPTS contains all expected sections."""
        expected_keys = {"about", "projects", "experience", None}
        assert set(SECTION_PROMPTS.keys()) == expected_keys

    def test_none_section_prompt_is_empty_string(self) -> None:
        """Verify SECTION_PROMPTS[None] is empty string for default behavior."""
        assert SECTION_PROMPTS[None] == ""
