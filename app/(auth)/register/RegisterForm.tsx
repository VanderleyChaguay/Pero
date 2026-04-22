"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { routes } from "@/lib/routes"
import styles from "./register.module.css"

export default function RegisterForm() {
  const [email, setEmail]                   = useState("")
  const [password, setPassword]             = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError]                   = useState<string | null>(null)
  const [isLoading, setIsLoading]           = useState(false)
  const [success, setSuccess]               = useState(false)

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
    <div className={styles.card}>
      <div className="mb-8">
        <h1 className={styles.heading}>Crea account</h1>
        <p className={styles.subheading}>Registra un nuovo account amministratore</p>
      </div>

      {success ? (
        <div className={styles.success}>
          <p className="font-medium mb-1">Controlla la tua email</p>
          <p className={styles.subheading}>
            Abbiamo inviato un link di conferma a <strong>{email}</strong>.
            Clicca sul link per attivare il tuo account.
          </p>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
            <label htmlFor="password" className={styles.label}>
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password" className={styles.label}>
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

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Creazione in corso..." : "Crea account"}
          </button>
        </form>
      )}

      <p className={styles.footer}>
        Hai già un account?{" "}
        <Link href={routes.auth.login} className={`font-medium ${styles.link}`}>
          Accedi
        </Link>
      </p>
    </div>
  )
}
