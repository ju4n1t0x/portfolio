import { useState } from "react"
import type { Project } from "@/types"
import { ExternalLink, Github, Maximize2 } from "lucide-react"
import { ImageModal } from "@/components/atoms"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [modalImage, setModalImage] = useState<string | URL | null>(null)

  return (
    <div className="space-y-3">
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-foreground/90 leading-relaxed text-sm">
        {project.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Thumbnail images */}
      {project.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin">
          {project.images.map((img, index) => (
            <div key={index} className="relative group flex-shrink-0">
              <img
                src={typeof img === "string" ? img : img.toString()}
                alt={`${project.title} preview ${index + 1}`}
                className="rounded-lg border border-border/40 object-cover h-36 w-auto cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                loading="lazy"
                onClick={() => setModalImage(img)}
              />
              {/* Hover overlay with expand icon - pointer-events-none so clicks pass through to img */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Links */}
      {(project.repoUrl ?? project.projectUrl) && (
        <div className="flex items-center gap-3 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Repositorio
            </a>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver proyecto
            </a>
          )}
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        src={modalImage || ""}
        alt={`${project.title} preview`}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </div>
  )
}
