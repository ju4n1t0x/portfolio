import { create } from "zustand"
import type { ChatState, ThemeState } from "../types"

const initialContactData = { name: undefined, email: undefined, message: undefined }

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  sidebarOpen: true,
  contactFlowStep: null,
  contactData: { ...initialContactData },
  currentSection: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),

  setTyping: (typing) => set({ isTyping: typing }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  startContactFlow: () => set({ contactFlowStep: "name", contactData: { ...initialContactData } }),

  setContactFlowStep: (step) => set({ contactFlowStep: step }),

  setContactData: (data) =>
    set((state) => ({ contactData: { ...state.contactData, ...data } })),

  resetContactFlow: () =>
    set({ contactFlowStep: null, contactData: { ...initialContactData } }),

  clearMessages: () => set({ messages: [] }),

  setCurrentSection: (section) => set({ currentSection: section }),
}))

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (typeof window !== "undefined" && localStorage.getItem("theme") === "light") ? "light" : "dark",

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return { theme: next }
    }),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
    set({ theme })
  },
}))
