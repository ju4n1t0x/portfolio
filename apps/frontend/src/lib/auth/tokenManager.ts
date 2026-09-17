const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

class TokenManager {
  private initialized: boolean = false
  private initPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    if (this.initialized) return
    if (this.initPromise) {
      await this.initPromise
      return
    }
    this.initPromise = this.ensureSession()
    try {
      await this.initPromise
      this.initialized = true
    } finally {
      this.initPromise = null
    }
  }

  private async ensureSession(): Promise<void> {
    try {
      const verify = await fetch(`${API_BASE_URL}/auth/verify`, {
        credentials: "include",
      })
      if (verify.ok) return
    } catch {
      // fall through to token issuance
    }
    await this.fetchNewSession()
  }

  private async fetchNewSession(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      credentials: "include",
    })
    if (!response.ok) {
      throw new Error("Failed to establish session")
    }
  }

  async refreshAccessToken(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (!response.ok) {
      await this.fetchNewSession()
      return
    }
  }

  async getAccessToken(): Promise<string> {
    await this.initialize()
    return ""
  }

  getAccessTokenSync(): string | null {
    return null
  }

  clearTokens(): void {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined)
    this.initialized = false
  }

  hasRefreshToken(): boolean {
    return this.initialized
  }
}

export const tokenManager = new TokenManager()
