import type { SidebarSectionId } from "@/types"

interface ChatRequest {
  message: string
  section?: SidebarSectionId | null
}

interface ChatResponse {
  response: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function sendChatMessage(
  message: string,
  section?: SidebarSectionId | null
): Promise<ChatResponse> {
  const body: ChatRequest = { message }
  
  // Only include section if it's a valid value (not null/undefined)
  if (section) {
    body.section = section
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
  }

  return response.json()
}
