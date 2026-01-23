"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteNews } from "@/lib/actions"

interface DeleteNewsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsId: string
    newsTitle: string
    onDeleted?: (newsId: string) => void
}

export function DeleteNewsDialog({
    open,
    onOpenChange,
    newsId,
    newsTitle,
    onDeleted,
}: DeleteNewsDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteNews(newsId)

        if (result.success) {
            onDeleted?.(newsId)
            onOpenChange(false)
        }

        setIsDeleting(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-[#05080C]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Supprimer la news ?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Êtes-vous sûr de vouloir supprimer "{newsTitle}" ? Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="rounded-xl border-white/10 bg-white/5">Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-white hover:bg-destructive/90 rounded-xl"
                    >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
