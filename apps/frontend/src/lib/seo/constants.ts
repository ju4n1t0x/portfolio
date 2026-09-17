export const SECTIONS = [
  { id: "about", label: "Sobre mí", path: "/", changefreq: "weekly", priority: "0.9" },
  { id: "projects", label: "Proyectos", path: "/?section=projects", changefreq: "monthly", priority: "0.8" },
  { id: "experience", label: "Experiencia", path: "/?section=experience", changefreq: "monthly", priority: "0.8" },
  { id: "contact", label: "Contacto", path: "/?section=contact", changefreq: "yearly", priority: "0.5" },
] as const;

export const SCHEMA_BASE = "https://schema.org";
export const SCHEMA_CONTEXT = `${SCHEMA_BASE}`;