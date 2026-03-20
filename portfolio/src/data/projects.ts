import type { Project } from "@/types"

// SteelMat images
import steelmat1 from "@/assets/Steelmat/steelmat-1.webp"
import steelmat3 from "@/assets/Steelmat/steelmat-3.webp"

// Portfolio images
import portfolio1 from "@/assets/Portfolio/portfolio-1.webp"
import portfolio2 from "@/assets/Portfolio/portfolio-2.webp"

export const projects: Project[] = [
  {
    id: "1",
    title: "API RESTful - Xinergia",
    description:
      "Migración y desarrollo de API RESTful para dashboard administrativo de plataforma e-learning. El sistema gestiona cursos online, usuarios y transacciones, exponiendo endpoints seguros para consumo de aplicaciones de terceros.",
    technologies: ["PHP 8.3", "Laravel 12", "JWT", "MySQL", "Bruno"],
    repoUrl: "Repositorio privado por políticas de seguridad de la empresa",
    projectUrl: "",
    images: [],
  },
  {
    id: "2",
    title: "SteelMat - Sitio Corporativo",
    description:
      "Desarrollo de sitio web corporativo para empresa de construcción en seco. Diseño moderno y responsive con sistema de contacto mediante emails transaccionales. Incluye migración de hosting y optimización SEO para posicionamiento local.",
    technologies: ["Astro", "TypeScript", "Resend", "Tailwind CSS"],
    repoUrl: "https://github.com/ju4n1t0x/steelmat",
    projectUrl: "https://steelmat.com.ar",
    images: [steelmat1, steelmat3],
  },
  {
    id: "3",
    title: "Portfolio Personal",
    description:
      "Portfolio profesional con interfaz conversacional estilo ChatGPT. El frontend en React se comunica con un backend en FastAPI que implementa RAG (Retrieval-Augmented Generation) para responder consultas sobre mi perfil profesional. Arquitectura fullstack con autenticación JWT, containerización con Docker, deploy automatizado en Dokploy y dominio gestionado con Cloudflare.",
    technologies: ["React 19", "TypeScript", "Zustand", "Tailwind CSS", "FastAPI", "Python", "OpenRouter", "Docker", "Dokploy", "Cloudflare"],
    repoUrl: "https://github.com/ju4n1t0x/portfolio",
    projectUrl: "https://juansasia.com",
    images: [portfolio1, portfolio2],
  },
]
