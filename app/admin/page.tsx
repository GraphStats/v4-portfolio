import { redirect } from "next/navigation"
import { checkAdminSession } from "@/lib/auth"
import AdminLoginForm from "@/components/admin-login-form"

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const hasSession = await checkAdminSession()

  if (hasSession) {
    redirect("/admin/dashboard")
  }

  return <AdminLoginForm />
}