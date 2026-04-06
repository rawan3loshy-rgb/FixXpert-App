import Link from "next/link"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#020617] text-white min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-[#1e293b]">

        <Link href="/" className="text-xl font-bold text-indigo-400">
          ⚡ FixXpert
        </Link>

        <nav className="flex gap-6 text-sm text-gray-300">
          <Link href="/support">Support</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">Über uns</Link>
          <Link href="/terms">Terms</Link>
        </nav>

        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-300">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-500 px-4 py-2 rounded-md text-sm"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-[#1e293b] px-8 py-10 text-sm text-gray-400">

        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div>
            <h3 className="text-white mb-2">FixXpert</h3>
            <p>Smart repair management system.</p>
          </div>

          <div>
            <h3 className="text-white mb-2">Support</h3>
            <p>Email</p>
            <p>Help Center</p>
          </div>

          <div>
            <h3 className="text-white mb-2">Legal</h3>
            <p>Terms</p>
            <p>Privacy</p>
          </div>

        </div>

      </footer>

    </div>
  )
}