"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import styles from "./register.module.css"

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Le password non coincidono")
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/admin`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore durante la registrazione")
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
          Crea account
        </h1>
        <p
          className="mt-1"
          style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
        >
          Registra un nuovo account amministratore
        </p>
      </div>

      {success ? (
        /* Inline success state */
        <div className={styles.success}>
          <p className="font-medium mb-1">Controlla la tua email</p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>
            Abbiamo inviato un link di conferma a <strong>{email}</strong>.
            Clicca sul link per attivare il tuo account.
          </p>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirm-password"
              className="font-medium"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-subtle)",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Conferma password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Submit */}
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Creazione in corso..." : "Crea account"}
          </button>
        </form>
      )}

      {/* Footer link */}
      <p
        className="mt-6 text-center"
        style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
      >
        Hai già un account?{" "}
        <Link href="/login" className={`font-medium ${styles.link}`}>
          Accedi
        </Link>
      </p>
    </div>
  )
}
