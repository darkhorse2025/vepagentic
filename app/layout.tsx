import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import type React from "react"

export const metadata: Metadata = {
  title: "VEPP - Virtual Employee Portal",
  description: "Your complete virtual employee portal for workplace management",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
  manifest: "/manifest.json",
  themeColor: "#7ab317",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}

import "./globals.css"



import './globals.css'