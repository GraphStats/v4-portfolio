"use client"

import { motion } from "framer-motion"
import { Code2, Globe, Database, Cpu, Palette, Zap, Cpu as ReactIcon, Wind, Layers3, Terminal } from "lucide-react"

const tech = [
    { name: "React", icon: ReactIcon, color: "text-blue-400" },
    { name: "Next.js", icon: Globe, color: "text-white" },
    { name: "TypeScript", icon: Code2, color: "text-blue-500" },
    { name: "Tailwind", icon: Wind, color: "text-cyan-400" },
    { name: "Firebase", icon: Database, color: "text-yellow-500" },
    { name: "Framer Motion", icon: Zap, color: "text-purple-500" },
    { name: "PostgreSQL", icon: Database, color: "text-indigo-400" },
    { name: "Node.js", icon: Terminal, color: "text-green-500" },
]

export function V4TechStack() {
    return (
        <section className="py-20 relative overflow-hidden bg-muted/5">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

            <div className="container mx-auto px-6 mb-12 text-center">
                <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground"
                >
                    Modern Technology Stack
                </motion.h3>
            </div>

            <div className="flex overflow-hidden group">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 whitespace-nowrap px-6"
                >
                    {[...tech, ...tech, ...tech].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group/item cursor-default">
                            <div className="p-4 rounded-2xl v4-glass border-white/5 group-hover/item:border-primary/50 transition-colors">
                                <item.icon className={`w-8 h-8 ${item.color} group-hover/item:scale-110 transition-transform`} />
                            </div>
                            <span className="text-2xl font-black text-muted-foreground group-hover/item:text-foreground transition-colors uppercase italic tracking-tighter">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
