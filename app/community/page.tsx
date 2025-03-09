"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Search, Users, DollarSign, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChatDialog } from "@/components/chat-dialog"
import { AddMemberForm } from "@/components/add-member-form"
import { getUserMembers } from "@/lib/member-service"
import { useAuth } from "@/hooks/use-auth"

interface Member {
  id: string
  name: string
  avatar?: string
  initials: string
  rank: string
  phone: string
  joinDate: string
  email?: string
  teamSize?: number
  earnings?: string
  location?: string
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const { user } = useAuth()

  const filters = ["All", "Diamond", "Platinum", "Gold", "Silver", "Bronze"]

  const loadUserMembers = async () => {
    if (!user) return

    setLoading(true)
    try {
      const userMembers = await getUserMembers(user.uid)
      setMembers(userMembers)
    } catch (error) {
      console.error("Error loading members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadUserMembers()
    }
  }, [user])

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.rank.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "All" || member.rank === activeFilter

    return matchesSearch && matchesFilter
  })

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Diamond":
        return "bg-blue-100 text-blue-800"
      case "Platinum":
        return "bg-purple-100 text-purple-800"
      case "Gold":
        return "bg-amber-100 text-amber-800"
      case "Silver":
        return "bg-gray-100 text-gray-800"
      case "Bronze":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="pb-16">
      <header className="app-header">
        <h1 className="text-xl font-bold">Community</h1>
        <Button variant="ghost" size="icon" onClick={() => setAddMemberOpen(true)}>
          <Plus className="h-5 w-5" />
        </Button>
      </header>

      <div className="p-4 content-area">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search members by name or rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant={filter === activeFilter ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer transition-all hover:scale-105"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="relative">
                <Link href={`/members/${member.id}`}>
                  <Card
                    className={`overflow-hidden transition-all duration-300 ${
                      hoveredMember === member.id ? "transform scale-[1.02] shadow-lg" : ""
                    }`}
                    onMouseEnter={() => setHoveredMember(member.id)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`${getRankColor(member.rank)} border-0`}>
                                {member.rank}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Joined {member.joinDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {hoveredMember === member.id && member.teamSize && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                              <Users className="w-3 h-3 mr-1" />
                              <span className="text-xs">Team Size</span>
                            </div>
                            <span className="font-medium">{member.teamSize}</span>
                          </div>

                          {member.earnings && (
                            <div className="flex flex-col items-center">
                              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                                <DollarSign className="w-3 h-3 mr-1" />
                                <span className="text-xs">Earnings</span>
                              </div>
                              <span className="font-medium">{member.earnings}</span>
                            </div>
                          )}

                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="text-xs">Joined</span>
                            </div>
                            <span className="font-medium">{member.joinDate}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>

                {/* Move the action buttons outside of the Link component */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-9 w-9 dark:border-gray-700 dark:text-gray-300 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary"
                    asChild
                  >
                    <a href={`tel:${member.phone}`}>
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call</span>
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-9 w-9 dark:border-gray-700 dark:text-gray-300 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedMember(member)
                      setChatOpen(true)
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="sr-only">Message</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedMember && <ChatDialog open={chatOpen} onOpenChange={setChatOpen} member={selectedMember} />}
      </div>
      <AddMemberForm open={addMemberOpen} onOpenChange={setAddMemberOpen} onSuccess={loadUserMembers} />
    </div>
  )
}

