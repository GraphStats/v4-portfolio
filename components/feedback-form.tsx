"use client"

import { useState, type FormEvent } from "react"
import { Loader2, Send, CheckCircle2, Star } from "lucide-react"
import { toast } from "sonner"

import { submitFeedback } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FeedbackForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [rating, setRating] = useState(5)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.set("rating", String(rating))

      const result = await submitFeedback(formData)
      if (!result.success) {
        toast.error("Impossible d'envoyer le feedback")
        setIsLoading(false)
        return
      }

      toast.success("Feedback envoye")
      setIsSuccess(true)
      event.currentTarget.reset()
      setRating(5)
    } catch (error) {
      console.error("Feedback submit error:", error)
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5 py-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tight">Merci pour ton retour</h3>
          <p className="text-muted-foreground">Ton feedback a bien ete enregistre dans le systeme.</p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => setIsSuccess(false)}>
          Envoyer un autre feedback
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nom (optionnel)</Label>
          <Input id="name" name="name" placeholder="Ton nom" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optionnel)</Label>
          <Input id="email" name="email" type="email" placeholder="ton@email.com" className="h-11 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Note globale</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1"
              aria-label={`Donner ${value} etoiles`}
            >
              <Star className={`w-6 h-6 ${value <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="positive_points">Ce qui est bien</Label>
        <Textarea
          id="positive_points"
          name="positive_points"
          required
          placeholder="Ex: design, fluidite, projets..."
          className="min-h-28 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="negative_points">Ce qui est a ameliorer</Label>
        <Textarea
          id="negative_points"
          name="negative_points"
          required
          placeholder="Ex: navigation, lisibilite, performances..."
          className="min-h-28 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_comment">Commentaire additionnel (optionnel)</Label>
        <Textarea
          id="additional_comment"
          name="additional_comment"
          placeholder="Ajoute des details si besoin"
          className="min-h-24 rounded-xl"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Envoyer le feedback
          </>
        )}
      </Button>
    </form>
  )
}
