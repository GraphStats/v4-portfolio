"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createConversation, getConversation } from "@/lib/actions"
import { Conversation } from "@/lib/types"
import { ChatWindow } from "./chat-window"
import { Loader2, MessageSquarePlus, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function ChatInterface({ isAvailable = true }: { isAvailable?: boolean }) {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    const checkExistingChat = async () => {
        setIsLoading(true)
        const storedId = localStorage.getItem("portfolio_chat_id")

        if (storedId) {
            const result = await getConversation(storedId)
            if (result.success && result.conversation) {
                setConversation(result.conversation as Conversation)
            } else {
                // Invalid ID or error, verify if we should clear it
                if (result.error === "Conversation not found") {
                    localStorage.removeItem("portfolio_chat_id")
                }
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        checkExistingChat()
        // Simple polling every 10 sec to get new messages
        const interval = setInterval(() => {
            const storedId = localStorage.getItem("portfolio_chat_id")
            if (storedId) {
                getConversation(storedId).then(res => {
                    if (res.success && res.conversation) {
                        setConversation(res.conversation as Conversation)
                    }
                })
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [])

    const handleCreateConversation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsCreating(true)

        const formData = new FormData(e.currentTarget)
        const result = await createConversation(formData)

        if (result.success && result.conversationId) {
            localStorage.setItem("portfolio_chat_id", result.conversationId)
            await checkExistingChat() // Load the new conversation
            toast.success("Discussion démarrée !")
        } else {
            toast.error("Erreur lors de la création de la discussion.")
        }
        setIsCreating(false)
    }

    const refreshChat = async () => {
        if (conversation) {
            const result = await getConversation(conversation.id)
            if (result.success && result.conversation) {
                setConversation(result.conversation as Conversation)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Connexion au serveur sécurisé...</p>
            </div>
        )
    }

    if (conversation) {
        return (
            <div className="w-full space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Discussion en cours
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                            Sujet: {conversation.subject}
                        </p>
                    </div>
                </div>
                <ChatWindow conversation={conversation} currentUserType="user" onRefresh={refreshChat} />
            </div>
        )
    }

    return (
        <div className="w-full space-y-6 animate-in hover:-translate-y-1 transition-transform duration-500">
            <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-black tracking-tight text-white">Démarrer une discussion</h2>
                <p className="text-muted-foreground">Une réponse plus rapide et interactive directement ici.</p>
            </div>

            {!isAvailable ? (
                <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <Sparkles className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-red-500">Projets fermés</h3>
                        <p className="text-muted-foreground">Je ne suis pas disponible pour de nouveaux projets pour le moment. Réessayez plus tard !</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleCreateConversation} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nom</label>
                            <Input name="name" required placeholder="Votre nom" className="h-12 rounded-xl bg-background/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                            <Input name="email" type="email" required placeholder="Pour notification" className="h-12 rounded-xl bg-background/50 border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Sujet</label>
                        <Input name="subject" required placeholder="De quoi s'agit-il ?" className="h-12 rounded-xl bg-background/50 border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                        <Textarea name="message" required placeholder="Comment puis-je vous aider ?" className="min-h-[120px] rounded-xl bg-background/50 border-white/10 p-4 resize-none" />
                    </div>

                    <Button disabled={isCreating} type="submit" className="w-full h-14 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                        {isCreating ? <Loader2 className="animate-spin" /> : (
                            <>
                                <MessageSquarePlus className="mr-2 h-5 w-5" />
                                Lancer le Chat
                            </>
                        )}
                    </Button>
                </form>
            )}
        </div>
    )
}
