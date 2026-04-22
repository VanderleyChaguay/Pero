"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { routes } from "@/lib/routes"
import styles from "./login.module.css"

export default function LoginForm() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.refresh()
      router.push(routes.admin.dashboard)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante l'accesso")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className="mb-8">
        <h1 className={styles.heading}>Accedi</h1>
        <p className={styles.subheading}>Inserisci le tue credenziali per accedere</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nome@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <Link href="/auth/forgot-password" className={`${styles.link} text-xs`}>
              Password dimenticata?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>

      <p className={styles.footer}>
        Non hai un account?{" "}
        <Link href={routes.auth.signup} className={`font-medium ${styles.link}`}>
          Registrati
        </Link>
      </p>
    </div>
  )
}
