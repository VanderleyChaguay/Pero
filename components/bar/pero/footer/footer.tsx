// Footer component for Bar Però
// Uses "use cache" to calculate the year on the server at build time
// This is the Next.js recommended approach for static time values in footers

import Image from "next/image"
import styles from "./footer.module.css"

// "use cache" tells Next.js this function can be cached at build time
// The year value is calculated once and reused — no dynamic request needed
async function getCurrentYear() {
  "use cache"
  return new Date().getFullYear()
}

export async function PeroFooter() {
  const year = await getCurrentYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Image
          src="/images/pero/PeroWithoutBackGround.png"
          alt="Però"
          width={78}
          height={50}
          className={styles.logo}
        />
        <div className={styles.social}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://facebook.com"  target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://tiktok.com"    target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <span className={styles.copy}>
          © {year} Però · Savona
        </span>
      </div>
    </footer>
  )
}