import LoginForm from "./LoginForm"

export const metadata = {
  title: "Accedi — Birro Admin",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6 bg-bg-app">
      <LoginForm />
    </main>
  )
}
