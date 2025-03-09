"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Search, Trophy, Users, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Game {
  id: string
  name: string
  image: string
  category: string
  players: string
  duration: string
  description: string
}

export default function GamesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const games: Game[] = [
    {
      id: "1",
      name: "Magnetar Millionaire",
      image: "/placeholder.svg?height=200&width=350",
      category: "Strategy",
      players: "2-4",
      duration: "15 min",
      description: "Build your Magnetar business empire and become a millionaire!",
    },
    {
      id: "2",
      name: "Product Match",
      image: "/placeholder.svg?height=200&width=350",
      category: "Memory",
      players: "1",
      duration: "5 min",
      description: "Test your product knowledge by matching products with their benefits.",
    },
    {
      id: "3",
      name: "Recruitment Race",
      image: "/placeholder.svg?height=200&width=350",
      category: "Arcade",
      players: "1-2",
      duration: "10 min",
      description: "Race against time to recruit new team members and build your downline.",
    },
    {
      id: "4",
      name: "Magnetar Trivia",
      image: "/placeholder.svg?height=200&width=350",
      category: "Quiz",
      players: "1-4",
      duration: "20 min",
      description: "Test your knowledge about Magnetar products, history, and business model.",
    },
    {
      id: "5",
      name: "Sales Simulator",
      image: "/placeholder.svg?height=200&width=350",
      category: "Simulation",
      players: "1",
      duration: "15 min",
      description: "Practice your sales pitch in various scenarios with virtual customers.",
    },
    {
      id: "6",
      name: "Rank Climber",
      image: "/placeholder.svg?height=200&width=350",
      category: "Adventure",
      players: "1",
      duration: "30 min",
      description: "Climb the ranks from Bronze to Diamond by completing challenges.",
    },
  ]

  const categories = ["All", "Strategy", "Memory", "Arcade", "Quiz", "Simulation", "Adventure"]

  const filteredGames = games.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Magnetar Games</h1>
        <Button variant="ghost" size="icon">
          <Trophy className="h-5 w-5" />
        </Button>
      </header>

      <div className="p-4 content-area">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer transition-all hover:scale-105"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={game.image || "/placeholder.svg"}
                    alt={game.name}
                    width={350}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary">{game.category}</Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold mb-1">{game.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="mr-3">{game.players} players</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{game.duration}</span>
                    </div>
                    <Button size="sm" onClick={() => alert(`Starting ${game.name}...`)}>
                      Play
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

