"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Download, Star, ExternalLink } from "lucide-react"
import Image from "next/image"

interface AppItem {
  id: string
  name: string
  description: string
  icon: string
  rating: number
  downloads: string
  category: string
}

export default function AppsPage() {
  const router = useRouter()

  const apps: AppItem[] = [
    {
      id: "1",
      name: "Magnetar Tracker",
      description: "Track your team's performance and earnings in real-time",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      downloads: "50K+",
      category: "Business",
    },
    {
      id: "2",
      name: "Magnetar Presenter",
      description: "Interactive presentations for product demos",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
      downloads: "25K+",
      category: "Business",
    },
    {
      id: "3",
      name: "Magnetar Calculator",
      description: "Calculate commissions and bonuses instantly",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      downloads: "100K+",
      category: "Finance",
    },
    {
      id: "4",
      name: "Magnetar Learning",
      description: "Mobile learning platform for on-the-go training",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
      downloads: "75K+",
      category: "Education",
    },
    {
      id: "5",
      name: "Magnetar Connect",
      description: "Connect with team members and prospects",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
      downloads: "60K+",
      category: "Social",
    },
    {
      id: "6",
      name: "Magnetar Events",
      description: "Find and register for Magnetar events near you",
      icon: "/placeholder.svg?height=80&width=80",
      rating: 4.4,
      downloads: "30K+",
      category: "Lifestyle",
    },
  ]

  const categories = ["All", "Business", "Finance", "Education", "Social", "Lifestyle"]

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Magnetar Apps</h1>
        <div className="w-9"></div>
      </header>

      <div className="p-4 content-area">
        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar">
          {categories.map((category, index) => (
            <Button key={index} variant={index === 0 ? "default" : "outline"} className="whitespace-nowrap" size="sm">
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-4">
          {apps.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.name}
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{app.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{app.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <div className="flex items-center mr-3">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span>{app.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        <span>{app.downloads}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => alert(`Installing ${app.name}...`)}>
                      Install
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open("https://magnetar.com/apps", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            View All Apps
          </Button>
        </div>
      </div>
    </div>
  )
}

