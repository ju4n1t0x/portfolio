import type { Experience } from "@/types"

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Xinergia",
    role: "Backend Developer",
    period: { start: "2025", end: "Presente" },
    description:
      "Migración y modernización de API REST legacy de PHP 5 a PHP 8.3 con Laravel 12 para institución educativa. Diseño de endpoints RESTful con autenticación basada en clave pública/privada. Implementación de mejoras funcionales para aumentar competitividad en el mercado.",
    technologies: ["PHP 8.3", "Laravel 12", "JWT", "MySQL", "Bruno"],
    companyUrl: "https://www.xinergia.com",
  },
  {
    id: "2",
    company: "SteelMat",
    role: "Full Stack Developer",
    period: { start: "2025", end: "2026" },
    description:
      "Desarrollo integral de sitio web corporativo para empresa de construcción en seco. Gestión de migración de hosting y configuración de servicio de mailing corporativo con dominio propio.",
    technologies: ["Astro", "TypeScript", "Resend", "Tailwind CSS"],
    companyUrl: "https://www.steelmat.com.ar",
  },
  {
    id: "3",
    company: "UTN - Facultad Regional Santa Fe",
    role: "Tutor Académico",
    period: { start: "2025", end: "Presente" },
    description:
      "Tutor en la Tecnicatura Universitaria en Tecnologías de la Información. Acompañamiento académico a estudiantes en las asignaturas Diseño de Sistemas de Información y Desarrollo de Sitios Web. Apoyo en resolución de trabajos prácticos, refuerzo de conceptos teóricos y mentoría en buenas prácticas de desarrollo.",
    technologies: ["UML", "Diagramas de flujo", "HTML", "CSS", "JavaScript"],
    companyUrl: "https://www.frsf.utn.edu.ar",
  },
]
