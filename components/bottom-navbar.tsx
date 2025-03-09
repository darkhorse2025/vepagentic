"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Settings, Users, Home } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function BottomNavbar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Don't show navbar on public routes or splash/onboarding pages
  if (!user || pathname === "/" || pathname === "/onboarding" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider flex justify-around items-center h-16 z-50 dark:bg-surface dark:border-divider">
      <Link href="/home" className={`nav-icon ${isActive("/home") ? "active" : ""}`}>
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link href="/e-learn" className={`nav-icon ${isActive("/e-learn") ? "active" : ""}`}>
        <BookOpen size={24} />
        <span className="text-xs mt-1">Training</span>
      </Link>

      <Link href="/social" className="relative flex items-center justify-center">
        <div className="logo-circle absolute -top-7">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20%286%29-DZ6vnR0zopNGWIz3P4vi35ZwZckQRt.png"
            alt="VEPP Logo"
            width={55}
            height={55}
            className="object-cover"
          />
        </div>
        <div className="h-6"></div>
      </Link>

      <Link href="/community" className={`nav-icon ${isActive("/community") ? "active" : ""}`}>
        <Users size={24} />
        <span className="text-xs mt-1">Team</span>
      </Link>

      <Link href="/settings" className={`nav-icon ${isActive("/settings") ? "active" : ""}`}>
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  )
}

