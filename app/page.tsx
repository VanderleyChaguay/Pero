import Link from "next/link"

// Landing page — lets the user choose which bar to visit
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-2">Birro</h1>
      <p className="text-zinc-400 mb-12 text-sm">Scegli il tuo locale</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Each bar will have its own slug — we will create them in the database later */}
        <Link
          href="/bar/pero"
          className="w-full text-center border border-zinc-700 rounded-lg px-6 py-4 hover:bg-zinc-900 transition"
        >
          Bar Uno
        </Link>
        <Link
          href="/bar/bar-due"
          className="w-full text-center border border-zinc-700 rounded-lg px-6 py-4 hover:bg-zinc-900 transition"
        >
          Bar Due
        </Link>
        <Link
          href="/bar/bar-tre"
          className="w-full text-center border border-zinc-700 rounded-lg px-6 py-4 hover:bg-zinc-900 transition"
        >
          Bar Tre
        </Link>
      </div>
    </main>
  )
}