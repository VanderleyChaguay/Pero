"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import styles from "./login.module.css"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
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
      router.push("/admin")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante l'accesso")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
        padding: "2rem",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            color: "var(--color-text)",
          }}
        >
          Accedi
        </h1>
        <p
          className="mt-1"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
        >
          Inserisci le tue credenziali per accedere
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-medium"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-subtle)",
              letterSpacing: "var(--tracking-wide)",
            }}
          >
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

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-medium"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-subtle)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className={styles.link}
              style={{ fontSize: "var(--text-xs)" }}
            >
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

        {/* Error */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Submit */}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>

      {/* Footer link */}
      <p
        className="mt-6 text-center"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
      >
        Non hai un account?{" "}
        <Link href="/register" className={`font-medium ${styles.link}`}>
          Registrati
        </Link>
      </p>
    </div>
  )
}
