/**
 * generate-seo-assets.mjs
 * Build-time script to generate public/portfolio-content.json
 * Run via: node scripts/generate-seo-assets.mjs
 * 
 * Strategy: Use string matching to extract data, then manually map to SEO shape.
 */

import { writeFileSync, mkdirSync, readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

// --- Read TypeScript source as text ---
function readTsFile(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), "utf-8")
}

// --- Extract the array content between [ and matching ] ---
function extractArrayContent(content, exportName) {
  const marker = `export const ${exportName}`
  const startIdx = content.indexOf(marker)
  if (startIdx === -1) return null

  const equalsIdx = content.indexOf("=", startIdx)
  const arrayStart = content.indexOf("[", equalsIdx)
  if (arrayStart === -1) return null

  let depth = 0
  let endIdx = arrayStart
  for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === "[") depth++
    else if (content[i] === "]") {
      depth--
      if (depth === 0) { endIdx = i; break }
    }
  }
  return content.substring(arrayStart, endIdx + 1)
}

// --- Parse a simplified array string to objects ---
// Only handles: strings, numbers, arrays of strings, URLs
function parseSimpleArray(arrStr) {
  // Split by }, keeping track of objects
  const results = []
  
  // Find each object { ... }
  let depth = 0
  let objStart = -1
  
  for (let i = 0; i < arrStr.length; i++) {
    if (arrStr[i] === "{" && depth === 0) {
      objStart = i
    }
    if (arrStr[i] === "{") depth++
    if (arrStr[i] === "}") {
      depth--
      if (depth === 0 && objStart !== -1) {
        const objStr = arrStr.substring(objStart, i + 1)
        results.push(objStr)
        objStart = -1
      }
    }
  }
  
  // Parse each object string
  return results.map(parseObject)
}

// --- Parse a single object string ---
function parseObject(objStr) {
  const result = {}
  
  // Remove surrounding braces
  let inner = objStr.trim()
  if (inner.startsWith("{")) inner = inner.slice(1)
  if (inner.endsWith("}")) inner = inner.slice(0, -1)
  
  // Split by commas that are at depth 0
  const fields = []
  let depth = 0
  let fieldStart = 0
  let inString = false
  
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i]
    const prevC = i > 0 ? inner[i - 1] : ""
    // Handle escaped quotes
    if (c === '"' && prevC !== '\\') inString = !inString
    if (!inString) {
      if (c === "{" || c === "[") depth++
      if (c === "}" || c === "]") depth--
      if (c === "," && depth === 0) {
        fields.push(inner.substring(fieldStart, i))
        fieldStart = i + 1
      }
    }
  }
  if (fieldStart < inner.length) {
    fields.push(inner.substring(fieldStart))
  }
  
  // Parse each field: key: value
  for (const field of fields) {
    const colonIdx = field.indexOf(":")
    if (colonIdx === -1) continue
    
    let key = field.substring(0, colonIdx).trim()
    let value = field.substring(colonIdx + 1).trim()
    
    // Remove quotes from key if present
    if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1)
    
    // Parse value
    if (value.startsWith('"') && value.endsWith('"')) {
      // String value - remove surrounding quotes but preserve inner quotes
      value = value.slice(1, -1)
      // Unescape any escaped quotes
      value = value.replace(/\\"/g, '"')
      result[key] = value
    } else if (value.startsWith("[")) {
      // Array value - extract strings
      const arrContent = value.slice(1, value.lastIndexOf("]"))
      const items = []
      let itemDepth = 0
      let itemStart = 0
      let itemInString = false
      
      for (let i = 0; i <= arrContent.length; i++) {
        const c = arrContent[i]
        const prevC = i > 0 ? arrContent[i - 1] : ""
        if (c === '"' && prevC !== '\\') itemInString = !itemInString
        if (!itemInString) {
          if (c === "[" || c === "{") itemDepth++
          if (c === "]" || c === "}") itemDepth--
          if (c === "," && itemDepth === 0) {
            let item = arrContent.substring(itemStart, i).trim()
            if (item.startsWith('"') && item.endsWith('"')) item = item.slice(1, -1)
            if (item) items.push(item)
            itemStart = i + 1
          }
        }
        if (i === arrContent.length && itemStart < arrContent.length) {
          let item = arrContent.substring(itemStart).trim()
          if (item.startsWith('"') && item.endsWith('"')) item = item.slice(1, -1)
          if (item) items.push(item)
        }
      }
      result[key] = items
    } else if (value === "true") {
      result[key] = true
    } else if (value === "false") {
      result[key] = false
    } else if (!isNaN(value) && value !== "") {
      result[key] = Number(value)
    } else if (value.startsWith("{")) {
      // Nested object - parse recursively
      result[key] = parseObject(value)
    } else {
      result[key] = value
    }
  }
  
  return result
}

// --- SEO field mapping (per spec) ---
function mapProject(project) {
  return {
    name: project.title || project.name,
    description: project.description,
    url: project.projectUrl || project.repoUrl || "",
    keywords: Array.isArray(project.technologies) ? project.technologies.join(", ") : "",
    sameAs: project.repoUrl || "",
  }
}

function mapExperience(exp) {
  function parseYear(s) {
    if (!s) return null
    if (/^\d{4}$/.test(s)) return s
    const m = String(s).match(/(\d{4})/)
    return m ? m[1] : null
  }
  return {
    roleName: exp.role,
    worksFor: exp.company,
    startDate: parseYear(exp.period?.start),
    endDate: exp.period?.end === "Presente" ? undefined : parseYear(exp.period?.end),
    description: exp.description,
  }
}

// --- Load and parse data ---
const projectsContent = readTsFile("src/data/projects.ts")
const experiencesContent = readTsFile("src/data/experiences.ts")
const responsesContent = readTsFile("src/data/responses.ts")

const projectsRaw = extractArrayContent(projectsContent, "projects")
const experiencesRaw = extractArrayContent(experiencesContent, "experiences")

let projectsData = []
let experiencesData = []

try {
  const parsed = parseSimpleArray(projectsRaw || "[]")
  projectsData = parsed.map(mapProject)
  console.log(`Parsed ${projectsData.length} projects`)
} catch (e) {
  console.error("Failed to parse projects:", e.message)
}

try {
  const parsed = parseSimpleArray(experiencesRaw || "[]")
  experiencesData = parsed.map(mapExperience)
  console.log(`Parsed ${experiencesData.length} experiences`)
} catch (e) {
  console.error("Failed to parse experiences:", e.message)
}

// --- About response ---
const aboutMatch = responsesContent.match(/export const aboutResponse\s*=\s*"([^"]+)"/)
const aboutResponse = aboutMatch ? aboutMatch[1] : ""

// --- Build portfolio-content.json with correct SEO shape ---
const portfolioContent = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Juan Ignacio Sasia",
  jobTitle: "Full Stack Developer",
  url: "https://juansasia.com",
  email: "contacto@juansasia.com",
  description:
    "Técnico universitario en TI, estudiante de Lic. en Ciencia de Datos. Desarrollador full stack especializado en soluciones web modernas.",
  keywords: [
    "Full Stack Developer",
    "React",
    "TypeScript",
    "FastAPI",
    "Python",
    "Laravel",
    "Portfolio",
    "Desarrollador Web",
    "Argentina",
  ],
  sameAs: [
    "https://github.com/ju4n1t0x",
    "https://www.linkedin.com/in/juan-ignacio-sasia/",
  ],
  about: {
    "@type": "AboutPage",
    name: "Juan Ignacio Sasia",
    jobTitle: "Full Stack Developer",
    summary: aboutResponse,
    knowsAbout: [
      "Full Stack Development",
      "React",
      "TypeScript",
      "FastAPI",
      "Python",
      "Laravel",
      "Backend Development",
    ],
  },
  projects: projectsData,
  experience: experiencesData,
  contact: {
    email: "contacto@juansasia.com",
    github: "https://github.com/ju4n1t0x",
    linkedin: "https://www.linkedin.com/in/juan-ignacio-sasia/",
  },
}

// --- Write output ---
const OUT_PATH = resolve(ROOT, "public/portfolio-content.json")
mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, JSON.stringify(portfolioContent, null, 2), "utf-8")
console.log(`✅ Generated ${OUT_PATH}`)