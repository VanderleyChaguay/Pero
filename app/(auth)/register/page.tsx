import RegisterForm from "./RegisterForm"

export const metadata = {
  title: "Crea account — Birro Admin",
}

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-6"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <RegisterForm />
    </main>
  )
}
