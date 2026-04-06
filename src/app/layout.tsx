import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast-provider"

const font = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FixXpert",
  description: "Repair SaaS",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} text-white`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}