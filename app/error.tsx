'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
                    <h2 className="text-2xl font-semibold">Something went wrong</h2>
                </div>
                <p className="text-muted-foreground max-w-md">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset}>Try again</Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    )
}
