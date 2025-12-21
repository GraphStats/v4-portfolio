"use client"

interface TechItem {
  name: string
  logo: string // Changed from icon: LucideIcon
  // Removed color: string
}

const techStack: TechItem[] = [
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "SQL", logo: "https://www.svgrepo.com/show/303251/mysql-logo.svg" },
  { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "OVHcloud", logo: "https://help.ovhcloud.com/a2a82603cd444d10f0788c63c19c1a4e.iix" },
]

export function TechStack() {
  return (
    <section id="tech-stack" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          <div className="text-primary font-bold tracking-widest text-sm uppercase">Expertise</div>
          <h3 className="text-5xl md:text-6xl font-bold tracking-tight font-display">TECHNICAL ECOSYSTEM</h3>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Leveraging cutting-edge technologies to build robust, scalable,
            and future-proof digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-stretch">
          {techStack.map((tech, index) => {
            return (
              <div
                key={tech.name}
                className="group relative h-40 flex flex-col items-center justify-center gap-4 rounded-3xl glass border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                <div className="relative w-12 h-12 flex items-center justify-center p-1 group-hover:scale-125 transition-all duration-500">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 brightness-200 group-hover:brightness-100 transition-all duration-500"
                  />
                </div>
                <span className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
