import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowUpRight, Hammer, Wrench, Construction, CheckCircle2, Archive, PackageCheck, ImageOff, Trophy, History, Play, Pause, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { SignInButton } from "@clerk/nextjs"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { user } = useUser()
  const isSignedIn = !!user

  const isFinished = project.is_completed;
  const isArchived = project.is_archived;
  const isInDev = project.in_development;
  const isPaused = project.development_status === 'paused';
  const requiresAuth = project.requires_auth;

  return (
    <div className={`group relative rounded-3xl overflow-hidden glass h-full flex flex-col perspective-card reveal-up transition-all duration-500 
      ${isInDev ? "border-dashed border-white/20" : "border-white/5"}
      ${isFinished ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : ""}
      ${isArchived ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : ""}
    `}>
      <div className="relative z-10 h-full">
      {/* Auth Required Overlay */}
      {requiresAuth && !isSignedIn && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-3xl z-20">
          <div className="text-center space-y-4 p-6">
            <Lock className="h-12 w-12 text-white mx-auto animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Connexion requise</h3>
              <p className="text-white/80 text-sm max-w-xs">
                Ce projet nécessite une authentification pour être consulté.
              </p>
            </div>
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg">
                Se connecter
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      <div className={`${requiresAuth && !isSignedIn ? "blur-sm opacity-60" : ""}`}>

      {/* Glow Effect Overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 
        ${isFinished ? "group-hover:bg-emerald-500/5" : isArchived ? "group-hover:bg-indigo-500/5" : "group-hover:bg-primary/5"}
      `} />

      {project.image_url ? (
        <div className="relative w-full aspect-video bg-muted overflow-hidden">
          <Image
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover group-hover:scale-110 transition-transform duration-1000 ease-out 
              ${isInDev ? "grayscale brightness-50" : ""}
              ${isFinished ? "brightness-110 contrast-110" : isArchived ? "brightness-100" : ""}
            `}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

          {isInDev && (
            <>
              <div
                className={`absolute inset-x-0 top-0 h-[18%] construction-pattern ${isPaused ? 'paused' : ''}`}
                style={{
                  maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
                }}
              />
              <div className="absolute top-3 inset-x-0 flex items-center justify-center">
                <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                  <div className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl border-2 rotate-[-1deg] cursor-pointer flex items-center gap-1.5 ${isPaused
                    ? 'bg-orange-400 text-black border-black'
                    : 'bg-yellow-400 text-black border-black animate-pulse'
                    }`}>
                    {isPaused ? (
                      <>
                        <Pause className="h-3 w-3" />
                        Développement en pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        Développement en cours
                      </>
                    )}
                  </div>
                </Link>
              </div>
            </>
          )}

          {isFinished && (
            <div className="absolute top-3 right-3">
              <Link href="/tags-info" className="block hover:scale-110 transition-transform duration-300">
                <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border border-emerald-400/50 animate-bounce cursor-pointer">
                  <Trophy className="h-4 w-4" />
                </div>
              </Link>
            </div>
          )}

          {isArchived && !isFinished && (
            <div className="absolute top-3 right-3">
              <Link href="/tags-info" className="block hover:scale-110 transition-transform duration-300">
                <div className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg shadow-lg border border-indigo-400/30 backdrop-blur-md cursor-pointer">
                  <Archive className="h-4 w-4" />
                </div>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-muted/20 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors duration-500">
            <div className={`p-4 rounded-2xl border border-dashed transition-all duration-500 
              ${isFinished ? "border-emerald-500/20 bg-emerald-500/5" : isArchived ? "border-indigo-500/20 bg-indigo-500/5" : "border-white/10 bg-white/5 group-hover:border-primary/20"}
            `}>
              <ImageOff className={`h-8 w-8 transition-transform duration-500 group-hover:scale-110 
                ${isFinished ? "text-emerald-500/40" : isArchived ? "text-indigo-500/40" : "text-muted-foreground/40 group-hover:text-primary/40"}
              `} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500
              ${isFinished ? "text-emerald-500/30" : isArchived ? "text-indigo-500/30" : "text-muted-foreground/30 group-hover:text-primary/40"}
            `}>
              Projet sans visuel
            </span>
          </div>
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col space-y-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <h4 className={`text-2xl font-bold tracking-tight transition-all duration-500
                ${isFinished ? "text-emerald-400" : isArchived ? "text-indigo-400" : "text-gradient group-hover:text-primary"}
              `}>
                {project.title}
              </h4>
              {requiresAuth && !isSignedIn && (
                <Lock className="h-6 w-6 text-red-500 animate-pulse" />
              )}
              {isInDev && (
                <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                  <div className={`p-1.5 rounded-lg border cursor-pointer ${isPaused
                    ? 'bg-orange-400/10 border-orange-400/20'
                    : 'bg-yellow-400/10 border-yellow-400/20'
                    }`}>
                    {isPaused ? (
                      <Pause className="h-3.5 w-3.5 text-orange-400" />
                    ) : (
                      <Wrench className="h-3.5 w-3.5 text-yellow-400 animate-spin-slow" />
                    )}
                  </div>
                </Link>
              )}
              {isFinished && (
                <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </Link>
              )}
              {isArchived && (
                <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                  <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] cursor-pointer">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                </Link>
              )}
            </div>
            <div className={`p-2 rounded-full border transition-all duration-300 shadow-glow
              ${isFinished ? "bg-emerald-500/10 border-emerald-500/20 opacity-100 shadow-emerald-500/20" : isArchived ? "bg-indigo-500/10 border-indigo-500/20 opacity-100 shadow-indigo-500/20" : "bg-white/5 border-white/10 opacity-0 group-hover:opacity-100 shadow-primary/20"}
            `}>
              <ArrowUpRight className={`h-4 w-4 ${isFinished ? "text-emerald-500" : isArchived ? "text-indigo-500" : "text-primary"}`} />
            </div>
          </div>
          <p className={`text-muted-foreground leading-relaxed font-medium line-clamp-3 transition-colors 
            ${isInDev ? "italic opacity-70" : ""}
            ${isFinished ? "text-emerald-50/70" : isArchived ? "text-indigo-50/70" : ""}
          `}>
            {project.description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`rounded-full px-4 py-1 border-white/10 transition-all font-semibold text-[10px] uppercase tracking-wider
                  ${isFinished ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/80" : isArchived ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400/80" : "bg-white/5 group-hover:border-primary/50"}
                `}
              >
                {tag}
              </Badge>
            ))}
            {isInDev && (
              <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                <Badge variant="secondary" className={`rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-1 ${isPaused
                  ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                  : 'bg-primary/20 border-primary/30 text-primary animate-pulse'
                  }`}>
                  {isPaused ? (
                    <>
                      <Pause className="h-3 w-3" />
                      En pause
                    </>
                  ) : (
                    <>
                      WIP
                    </>
                  )}
                </Badge>
              </Link>
            )}
            {isFinished && (
              <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                <Badge variant="secondary" className="rounded-full px-4 py-1 bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer">
                  Finished
                </Badge>
              </Link>
            )}
            {isArchived && (
              <Link href="/tags-info" className="hover:scale-110 transition-transform duration-300">
                <Badge variant="secondary" className="rounded-full px-4 py-1 bg-indigo-500/20 border-indigo-500/30 text-indigo-400 font-bold text-[10px] uppercase tracking-widest cursor-pointer">
                  Archived
                </Badge>
              </Link>
            )}
          </div>

          {isInDev && (
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${isPaused
                  ? 'bg-orange-400/40'
                  : 'bg-yellow-400/40 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent'
                  }`}
                style={{ width: `${project.development_progress || 0}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-6 mt-auto">
          <div className="flex gap-4">
            {isInDev ? (
              <Button disabled className="flex-1 rounded-full bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed">
                <Construction className="mr-2 h-4 w-4" />
                Coming Soon
              </Button>
            ) : (
              project.project_url && (
                <Button asChild size="sm" disabled={requiresAuth && !isSignedIn} className={`flex-1 rounded-full font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95 shadow-lg
                  ${requiresAuth && !isSignedIn ? "opacity-50 cursor-not-allowed" : ""}
                  ${isFinished ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-emerald-500/20" : isArchived ? "bg-indigo-500 text-white hover:bg-indigo-400 hover:shadow-indigo-500/20" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-primary/20"}
                `}>
                  <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Link>
                </Button>
              )
            )}

            {project.github_url && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                disabled={requiresAuth && !isSignedIn}
                className={`flex-1 rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95
                  ${requiresAuth && !isSignedIn ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Code
                </Link>
              </Button>
            )}
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground transition-all duration-500 font-bold uppercase tracking-widest text-[10px] h-11"
          >
            <Link href={
              (project.slug === "my-portfolio-this-web-site" || project.title === "My portfolio (this web site)")
                ? "/update"
                : `/${project.slug || project.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}/update`
            }>
              <History className="mr-2 h-3.5 w-3.5" />
              View Updates
            </Link>
          </Button>
        </div>
      </div>
      </div>

      </div>

      {/* Auth Required Overlay */}
      {requiresAuth && !isSignedIn && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-3xl z-20">
          <div className="text-center space-y-4 p-6">
            <Lock className="h-12 w-12 text-white mx-auto animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Connexion requise</h3>
              <p className="text-white/80 text-sm max-w-xs">
                Ce projet nécessite une authentification pour être consulté.
              </p>
            </div>
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg">
                Se connecter
              </button>
            </SignInButton>
          </div>
        </div>
      )}
    </div>
  );
}
