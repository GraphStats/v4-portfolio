"use client"

import { useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment, deleteComment } from "@/lib/actions"
import type { NewsComment } from "@/lib/types"
import { toast } from "sonner"
import { MessageCircle, Send, Trash2, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import Image from "next/image"

interface NewsCommentsProps {
    newsId: string
    initialComments: NewsComment[]
}

export function NewsComments({ newsId, initialComments }: NewsCommentsProps) {
    const { user, isLoaded } = useUser()
    const [comments, setComments] = useState(initialComments)
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        if (!content.trim()) return

        setIsSubmitting(true)
        const result = await addComment(newsId, content)

        if (result.success) {
            // Optimistic update or just refresh
            // Since revalidatePath is used, we might want to just clear and local update
            const newComment: NewsComment = {
                id: Math.random().toString(), // Temp ID
                news_id: newsId,
                user_id: user.id,
                user_name: user.fullName || user.username || "Anonymous",
                user_image: user.imageUrl,
                content: content,
                created_at: new Date().toISOString(),
            }
            setComments([newComment, ...comments])
            setContent("")
            toast.success("Commentaire ajouté !")
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
        setIsSubmitting(false)
    }

    const handleDelete = async (commentId: string) => {
        const result = await deleteComment(commentId, newsId)
        if (result.success) {
            setComments(comments.filter(c => c.id !== commentId))
            toast.success("Commentaire supprimé")
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
    }

    return (
        <section id="comments" className="space-y-12">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tight">Discussion</h3>
            </div>

            <div className="v4-glass p-8 rounded-[2.5rem] border-white/10 space-y-8">
                {!isLoaded ? (
                    <div className="h-20 animate-pulse bg-white/5 rounded-2xl" />
                ) : user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                <Image src={user.imageUrl} alt={user.fullName || "User"} fill className="object-cover" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Posting as {user.firstName}</span>
                        </div>
                        <Textarea
                            placeholder="Partagez votre avis sur cette news..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] rounded-3xl border-white/10 bg-white/5 focus:bg-white/10 transition-colors p-6 text-sm"
                            required
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? "Envoi..." : (
                                    <span className="flex items-center gap-2">
                                        <Send className="h-3.5 w-3.5" />
                                        Poster le commentaire
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="p-10 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.01] text-center space-y-6">
                        <div className="space-y-2">
                            <p className="text-lg font-bold uppercase italic tracking-tight">Join the conversation</p>
                            <p className="text-muted-foreground text-sm font-medium">Connectez-vous pour partager vos impressions.</p>
                        </div>
                        <SignInButton mode="modal">
                            <Button className="rounded-full h-12 px-8 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90">
                                Se connecter
                            </Button>
                        </SignInButton>
                    </div>
                )}

                <div className="space-y-8 pt-8 border-t border-white/5">
                    {comments.length === 0 ? (
                        <p className="text-center text-muted-foreground font-medium py-10 italic">
                            Aucun commentaire pour le moment. Soyez le premier à réagir !
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-6 group">
                                <div className="grow-0">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden glass border-white/10 relative">
                                        {comment.user_image ? (
                                            <Image src={comment.user_image} alt={comment.user_name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-muted-foreground">
                                                <User className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="space-x-3">
                                            <span className="text-sm font-black uppercase tracking-tight text-white">{comment.user_name}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                                            </span>
                                        </div>
                                        {user?.id === comment.user_id && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="p-2 rounded-lg text-muted-foreground/0 group-hover:text-destructive/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
