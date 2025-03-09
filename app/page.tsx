"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashScreen() {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in animation
    setOpacity(1)

    // Redirect to onboarding after 3 seconds
    const timer = setTimeout(() => {
      setOpacity(0) // Fade out
      setTimeout(() => {
        router.push("/onboarding")
      }, 500) // Wait for fade out animation to complete
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#121212] z-50">
      <div className="transition-opacity duration-500 ease-in-out flex flex-col items-center" style={{ opacity }}>
        <div className="animate-pulse">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20%286%29-DZ6vnR0zopNGWIz3P4vi35ZwZckQRt.png"
            alt="VEPP Logo"
            width={150}
            height={150}
            className="mb-4"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mt-4">VEPP</h1>
        <p className="text-text-secondary mt-2">Virtual Employee Portal</p>
      </div>
    </div>
  )
}

