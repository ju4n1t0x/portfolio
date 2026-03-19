import ollama 
from app.client.semantic_search import retrieve_relevant_context

SYSTEM_PROMPT = """You are the professional assistant of Juan Ignacio (Full Stack Developer). 
Your role is strictly limited to discussing Juan Ignacio's professional background,
skills, experience, and career information that appears in the provided context.

IMPORTANT RESTRICTIONS:
- ONLY respond about topics present in the provided CV/context
- If asked about anything outside Juan Ignacio's professional profile, politely decline
- Do not provide opinions, general knowledge, or information not in the context
- If the question is unclear but relates to the CV, ask for clarification

Example refusals:
- "I'm specifically designed to assist with questions about Juan Ignacio's professional background. I'd be happy to discuss his skills, experience, or projects if you have questions about them."
- "My responses are limited to the professional context of Juan Ignacio's portfolio. I'm not able to help with other topics."
"""

SECTION_PROMPTS: dict[str | None, str] = {
    "about": """
The user is currently viewing the "About" section.
Focus your responses on:
- Juan Ignacio's professional profile and background
- Personal values, work philosophy, and approach
- Education and continuous learning
- Soft skills and professional qualities
Avoid going into deep technical project details unless directly asked.
""",
    "projects": """
The user is currently viewing the "Projects" section.
Focus your responses on:
- Technical projects Juan Ignacio has worked on
- Technologies, frameworks, and tools used
- Technical challenges and solutions
- Code architecture and implementation details
""",
    "experience": """
The user is currently viewing the "Experience" section.
Focus your responses on:
- Work history and professional roles
- Company context and team collaboration
- Responsibilities and achievements
- Career progression and growth
""",
    None: ""  # No section context, use base prompt only
}


def build_system_prompt(section: str | None = None) -> str:
    """Build the system prompt with optional section-specific context."""
    base = SYSTEM_PROMPT
    section_context = SECTION_PROMPTS.get(section, "")
    if section_context:
        return f"{base}\n\nCURRENT CONTEXT:\n{section_context}"
    return base

def ask_ai(question: str, section: str | None = None, model: str = "qwen2.5:0.5b") -> str:
    """Query the AI with optional section context for focused responses."""
    context = retrieve_relevant_context(question)
    system_prompt = build_system_prompt(section)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{question}"}
    ]

    try:
        response = ollama.chat(model=model, messages=messages)
        return response["message"]["content"]
    except Exception as e:
        return f"Error consulting Ollama: {str(e)}"
