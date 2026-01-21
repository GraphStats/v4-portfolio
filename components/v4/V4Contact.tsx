"use client"

import { motion } from "framer-motion"
import { Send, Mail, MapPin, Phone, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaDiscord } from 'react-icons/fa';

export function V4Contact() {
    return (
        <section id="contact" className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="v4-glass rounded-[3rem] p-12 md:p-24 overflow-hidden relative group">
                    {/* Animated pattern background */}
                    <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Available for Projects
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
                                >
                                    LET'S CREATE THE <span className="text-primary italic">FUTURE</span> TOGETHER.
                                </motion.h2>
                                <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                                    Whether you have a specific project in mind or just want to chat about technology, I'm always open to new possibilities.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Mail, label: "Email Me", value: "projet@drayko.xyz" },
                                    { icon: MapPin, label: "Location", value: "Earth, Remote" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group/item">
                                        <div className="w-14 h-14 rounded-2xl v4-glass border-white/5 flex items-center justify-center group-hover/item:border-primary/50 transition-colors">
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                                            <p className="text-xl font-bold text-foreground">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="w-full max-w-md p-8 rounded-[2rem] v4-glass border-white/10 relative"
                            >
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-black italic tracking-tight uppercase">Quick Send</h3>
                                        <p className="text-sm text-muted-foreground font-medium">Jump start our collaboration</p>
                                    </div>
                                    <Button asChild className="w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/20 text-sm font-black uppercase tracking-widest">
                                        <Link href="/contact">
                                            Open Contact Form
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/20 text-sm font-black uppercase tracking-widest">
                                        <Link href="https://discord.gg/nZwFrnEW">
                                            <FaDiscord className="w-3.5 h-3.5 mr-2" />
                                            Discord
                                        </Link>
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest">
                                        Average response time: &lt; 24 hours
                                    </p>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors" />
                                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-secondary/20 rounded-full blur-2xl group-hover:bg-secondary/40 transition-colors" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
