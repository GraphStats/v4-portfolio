"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, CheckCircle2 } from "lucide-react"
import { submitContactMessage } from "@/lib/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(event.currentTarget)
            const result = await submitContactMessage(formData)

            if (result.success) {
                setIsSuccess(true)
                toast.success("Message envoyé avec succès !")
            } else {
                toast.error("Erreur lors de l'envoi du message.")
                console.error(result.error)
            }
        } catch (e) {
            toast.error("Une erreur est survenue.")
        }
        setIsLoading(false)
    }

    if (isSuccess) {
        return (
            <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-glow shadow-primary/20">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Message Envoyé !</h3>
                <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
                    Merci de m'avoir contacté. Je vous répondrai dans les plus brefs délais sur votre adresse e-mail.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-xl border-white/10 hover:bg-white/5"
                >
                    Envoyer un autre message
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nom</label>
                    <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Votre nom"
                        className="h-11 rounded-xl bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="votre@email.com"
                        className="h-11 rounded-xl bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Sujet</label>
                <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Sujet de votre message"
                    className="h-11 rounded-xl bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Votre message..."
                    className="min-h-[150px] rounded-xl bg-background/50 border-white/10 focus:border-primary/50 transition-colors resize-none p-4"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02]"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                    </>
                )}
            </Button>
        </form>
    )
}
