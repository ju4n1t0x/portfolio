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
    title: "Portfolio Personal",
    description:
      "Portfolio profesional con interfaz conversacional estilo ChatGPT. El frontend en React 19 se comunica con un backend en FastAPI que implementa RAG (Retrieval-Augmented Generation) para responder consultas contextualizadas sobre mi perfil. Autenticación JWT, containerización con Docker y deploy automatizado en Dokploy.",
    technologies: ["React 19", "TypeScript", "Zustand", "Tailwind CSS", "FastAPI", "Python", "RAG", "JWT", "Docker", "Dokploy"],
    repoUrl: "https://github.com/ju4n1t0x/portfolio",
    projectUrl: "https://juansasia.com",
    images: [portfolio1, portfolio2],
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
    title: "AislaMat - Sistema de Gestión",
    description:
      "Plataforma de gestión para empresa de aislamiento térmico en construcción. Incluye landing page, simulador de presupuestos, panel de administración en Filament y dashboard de leads. Desarrollo activo en branch dev con pipeline de testing en Pest.",
    technologies: ["Laravel 13", "Filament v5", "Livewire v4", "Fortify", "Pest v4"],
    repoUrl: "https://github.com/ju4n1t0x/aislamat",
    projectUrl: "",
    images: [],
  },
  {
    id: "4",
    title: "Eficiencia Energética - Análisis de Datos",
    description:
      "Proyecto de ciencia de datos para análisis de eficiencia energética usando metodología CRISP-DM. Procesamiento de dataset CAMMESA de demanda eléctrica argentina, modelado predictivo con Gradient Boosting (R²=0.929) y deployment en Docker.",
    technologies: ["FastAPI", "React", "TypeScript", "PostgreSQL", "scikit-learn", "Pandas", "NumPy", "Docker"],
    repoUrl: "https://github.com/ju4n1t0x/eficiencia_energetica",
    projectUrl: "",
    images: [],
  },
]
