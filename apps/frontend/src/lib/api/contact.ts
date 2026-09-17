import { tokenManager } from "@/lib/auth/tokenManager"

interface ContactEmailData {
  name: string
  email: string
  consulta: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

export async function sendContactEmail(data: ContactEmailData) {
  await tokenManager.initialize()

  try {
    const response = await fetch(`${API_BASE_URL}/sendEmail`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Contact API error:", error)
      return { success: false, error }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending contact:", error)
    return { success: false, error }
  }
}
