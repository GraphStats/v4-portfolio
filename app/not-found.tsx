import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold">Page not found</h2>
                </div>
                <p className="text-muted-foreground max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild>
                    <Link href="/">Go back home</Link>
                </Button>
            </div>
        </div>
    )
}
