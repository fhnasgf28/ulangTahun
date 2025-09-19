"use client"

import type React from "react"

import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const searchParams = useSearchParams()

  return (
    <body className={`font-sans ${poppins.variable}`}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Analytics />
    </body>
  )
}
