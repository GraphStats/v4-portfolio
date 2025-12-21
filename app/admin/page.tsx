import { redirect } from "next/navigation"
import { checkAdminSession } from "@/lib/auth"
import AdminLoginForm from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  const hasSession = await checkAdminSession()

  if (hasSession) {
    // User is already logged in, redirect to dashboard
    redirect("/admin/dashboard")
  }

  // User is not logged in, show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  )
}
