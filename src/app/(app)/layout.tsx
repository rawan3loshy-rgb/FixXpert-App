import AppLayout from "@/components/layout/app-layout"
import ProtectedRoute from "@/components/auth/protected-route"
export default function Layout({ children }: { children: React.ReactNode }) {
 
  return  <ProtectedRoute><AppLayout>{children}</AppLayout></ProtectedRoute>
}