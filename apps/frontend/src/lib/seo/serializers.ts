import type { Project } from "@/types";
import type { Experience } from "@/types";
import { SCHEMA_CONTEXT, SCHEMA_BASE } from "./constants";

// --- URL helpers ---
export function projectUrl(project: Pick<Project, "projectUrl" | "repoUrl">): string | undefined {
  if (project.projectUrl) return project.projectUrl;
  if (project.repoUrl) return project.repoUrl;
  return undefined;
}

export function toUrl(relative: string, base: string): string {
  return relative.startsWith("http") ? relative : `${base.replace(/\/$/, "")}/${relative.replace(/^\//, "")}`;
}

// --- Date normalization ---
function isValidIsoDateFragment(s: string): boolean {
  return /^\d{4}(-\d{2}(-\d{2})?)?$/.test(s) && !s.includes(" ");
}

function parseYear(s: string): number | null {
  if (!/^\d{4}/.test(s)) return null;
  const y = parseInt(s.slice(0, 4), 10);
  return isNaN(y) ? null : y;
}

export function normalizeExperienceDates(start: string): { startDate?: string } {
  if (isValidIsoDateFragment(start)) return { startDate: start };
  const y = parseYear(start);
  return y !== null ? { startDate: String(y) } : {};
}

export function normalizeEndDate(end: string): { endDate?: string } {
  if (end === "Presente") return {};
  if (isValidIsoDateFragment(end)) return { endDate: end };
  // Drop MM/YYYY and other non-ISO fragments — do not coerce
  return {};
}

// --- JSON-LD node builders ---
export function buildPersonSchema(cfg: {
  name: string;
  jobTitle: string;
  url: string;
  image?: string;
  description?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}) {
  const node: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    "@id": `${SCHEMA_BASE}/Person`,
    name: cfg.name,
    jobTitle: cfg.jobTitle,
    url: cfg.url,
  };
  if (cfg.image) node.image = cfg.image;
  if (cfg.description) node.description = cfg.description;
  if (cfg.sameAs?.length) node.sameAs = cfg.sameAs;
  if (cfg.knowsAbout?.length) node.knowsAbout = cfg.knowsAbout;
  return node;
}

export function buildWebSiteSchema(cfg: { url: string; name: string; description: string; authorId?: string }) {
  const node: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: cfg.name,
    url: cfg.url,
    description: cfg.description,
  };
  if (cfg.authorId) node.publisher = { "@id": cfg.authorId };
  return node;
}

export function buildCreativeWorkSchema(project: Project, baseUrl: string, authorId: string) {
  const url = projectUrl(project);
  const node: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: { "@id": authorId },
  };
  if (url) node.url = toUrl(url, baseUrl);
  if (project.images?.[0]) node.image = toUrl(String(project.images[0]), baseUrl);
  if (project.technologies.length) node.keywords = project.technologies.join(", ");
  return node;
}

export function buildItemListSchema(experiences: Experience[], baseUrl: string) {
  const items = experiences.map((exp, idx) => {
    const { startDate } = normalizeExperienceDates(exp.period.start);
    const { endDate } = normalizeEndDate(exp.period.end);
    const org: Record<string, unknown> = { "@type": "Organization", name: exp.company };
    if (exp.companyUrl) org.url = exp.companyUrl;
    const role: Record<string, unknown> = { "@type": "Role", roleName: exp.role, startDate };
    if (endDate) role.endDate = endDate;
    return { "@type": "ListItem", position: idx + 1, item: { "@type": "OrganizationRole", ...role, worksFor: org } };
  });
  return { "@context": SCHEMA_CONTEXT, "@type": "ItemList", name: "Experiencia profesional", url: toUrl("/?section=experience", baseUrl), itemListElement: items };
}

export function buildGraph(cfg: {
  siteConfig: { name: string; jobTitle: string; url: string; image?: string; description?: string; sameAs?: string[]; knowsAbout?: string[] };
  projects: Project[];
  experiences: Experience[];
}) {
  const person = buildPersonSchema(cfg.siteConfig);
  const personId = person["@id"] as string;
  return [
    person,
    buildWebSiteSchema({ url: cfg.siteConfig.url, name: cfg.siteConfig.name, description: cfg.siteConfig.description ?? "", authorId: personId }),
    ...cfg.projects.map((p) => buildCreativeWorkSchema(p, cfg.siteConfig.url, personId)),
    buildItemListSchema(cfg.experiences, cfg.siteConfig.url),
  ];
}