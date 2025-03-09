"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  const slides = [
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20%281%29.jpg-F1DziMLtvT7BZs4GstYuSVLEHNxyac.png",
      title: "Welcome to VEPP",
      description: "Your virtual employee portal for seamless workplace management",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20%282%29.jpg-92SErDt4XpvmBteaNHOm5Hp76vgs2R.png",
      title: "Access Healthcare Benefits",
      description: "Manage your health and wellness programs with ease",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20%283%29.jpg-svUt97MHMDvwAEDcynjTBEUaMfDgEn.png",
      title: "Stay Compliant",
      description: "Access important policies and compliance requirements",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_fx_%20%284%29.jpg-Z44dCeA4DRjkTe6QMFmiMQOguH9VVJ.png",
      title: "Connect with Your Team",
      description: "Collaborate effectively in our digital workspace",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setFadeIn(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const handleGetStarted = () => {
    router.push("/signup")
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        <Image
          src={slides[currentSlide].image || "/placeholder.svg"}
          alt={slides[currentSlide].title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay with more opacity at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </div>

      {/* Content Container */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-32">
        <div className={`transition-opacity duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-white text-4xl font-bold mb-3">{slides[currentSlide].title}</h2>
          <p className="text-white/90 text-xl">{slides[currentSlide].description}</p>
        </div>
      </div>

      {/* Button Container */}
      <div className="absolute bottom-[50px] left-0 right-0 flex justify-center px-8">
        <Button
          onClick={handleGetStarted}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-lg text-lg font-medium"
        >
          Get Started
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-primary" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

