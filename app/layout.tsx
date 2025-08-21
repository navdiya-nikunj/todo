import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/lib/contexts/providers"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "RealmQuest - Gamified Todo App by Nikunj Navdiya",
  description: "Enter the realm, defeat your tasks, level up your life",
  generator: "Nikunj Navdiya",
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} dark`}>
      <body className="min-h-screen bg-realm-black text-realm-silver antialiased">
        <AppProviders>
          <div className="realm-grid-bg">{children}</div>
        </AppProviders>
      </body>
    </html>
  )
}
