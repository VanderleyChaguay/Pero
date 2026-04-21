import "@/styles/themes/admin/style.css"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="admin" className="min-h-screen">
      {children}
    </div>
  )
}
