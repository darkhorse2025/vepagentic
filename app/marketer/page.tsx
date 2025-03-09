"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  Search,
  Users,
  Database,
  Calendar,
  Mail,
  Layout,
  BarChart,
  FileText,
  UserPlus,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MarketingTool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  isPremium: boolean
}

export default function MarketerPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const marketingTools: MarketingTool[] = [
    {
      id: "1",
      name: "Lead Generator",
      description: "Generate high-quality leads based on your target audience criteria",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      category: "Lead Generation",
      isPremium: false,
    },
    {
      id: "2",
      name: "Web Data Scraper",
      description: "Extract valuable data from websites to build your prospect lists",
      icon: <Database className="h-6 w-6 text-green-600" />,
      category: "Data Collection",
      isPremium: true,
    },
    {
      id: "3",
      name: "Social Media Scheduler",
      description: "Schedule and automate your social media posts across platforms",
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      category: "Social Media",
      isPremium: false,
    },
    {
      id: "4",
      name: "Email Campaign Manager",
      description: "Create, send, and track email campaigns to nurture your leads",
      icon: <Mail className="h-6 w-6 text-red-600" />,
      category: "Email Marketing",
      isPremium: true,
    },
    {
      id: "5",
      name: "Landing Page Builder",
      description: "Create high-converting landing pages with drag-and-drop simplicity",
      icon: <Layout className="h-6 w-6 text-amber-600" />,
      category: "Web Tools",
      isPremium: true,
    },
    {
      id: "6",
      name: "Marketing Analytics",
      description: "Track and analyze your marketing performance with detailed insights",
      icon: <BarChart className="h-6 w-6 text-indigo-600" />,
      category: "Analytics",
      isPremium: false,
    },
    {
      id: "7",
      name: "Content Creator",
      description: "Generate marketing content with AI-powered assistance",
      icon: <FileText className="h-6 w-6 text-cyan-600" />,
      category: "Content",
      isPremium: true,
    },
    {
      id: "8",
      name: "Audience Segmentation",
      description: "Segment your audience for targeted marketing campaigns",
      icon: <UserPlus className="h-6 w-6 text-pink-600" />,
      category: "Lead Generation",
      isPremium: false,
    },
  ]

  const categories = [
    "All",
    "Lead Generation",
    "Data Collection",
    "Social Media",
    "Email Marketing",
    "Web Tools",
    "Analytics",
    "Content",
  ]

  const filteredTools = marketingTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Marketer Tools</h1>
        <div className="w-9"></div>
      </header>

      <div className="p-4 content-area">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search marketing tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={category === activeCategory ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">{tool.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold">{tool.name}</h3>
                      {tool.isPremium && (
                        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-0">
                          <Star className="h-3 w-3 mr-1 fill-amber-500" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    <Button
                      size="sm"
                      variant={tool.isPremium ? "outline" : "default"}
                      onClick={() => router.push(`/marketer/${tool.id}`)}
                      className={tool.isPremium ? "border-primary text-primary hover:bg-primary/10" : ""}
                    >
                      {tool.isPremium ? "Upgrade to Access" : "Open Tool"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-10">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <h3 className="font-bold mb-2">Marketer Pro Subscription</h3>
          <p className="text-sm text-gray-600 mb-3">
            Unlock all premium marketing tools and features with our Marketer Pro subscription.
          </p>
          <Button className="w-full">Upgrade to Pro</Button>
        </div>
      </div>
    </div>
  )
}

