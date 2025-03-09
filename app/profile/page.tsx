"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Camera, Edit, Award, TrendingUp, Clock, User, MapPin, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"

interface UserProfile {
  displayName: string
  email: string
  photoURL?: string
  rank: string
  joinDate: string
  earnings: {
    total: number
    monthly: number
    weekly: number
  }
  team: {
    size: number
    directRecruits: number
    activeMembers: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [rankProgress, setRankProgress] = useState(65)

  useEffect(() => {
    if (!user) return

    const userRef = ref(database, `users/${user.uid}`)

    const unsubscribe = onValue(userRef, (snapshot) => {
      setLoading(true)
      const data = snapshot.val()

      if (data) {
        setProfile(data)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getNextRank = (currentRank: string) => {
    const ranks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
    const currentIndex = ranks.indexOf(currentRank)

    if (currentIndex === -1 || currentIndex === ranks.length - 1) {
      return "Maximum Rank"
    }

    return ranks[currentIndex + 1]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">My Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => alert("Edit profile")}>
          <Edit className="h-5 w-5" />
        </Button>
      </header>

      <div className="content-area">
        <div className="bg-primary/10 p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-1">{profile?.displayName || user?.displayName || "User"}</h1>
          <div className="bg-primary/20 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
            {profile?.rank || "Member"}
          </div>

          <div className="w-full max-w-xs">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Progress to {getNextRank(profile?.rank || "Bronze")}</span>
              <span>{rankProgress}%</span>
            </div>
            <Progress value={rankProgress} className="h-2" />
          </div>
        </div>

        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-lg font-bold">{profile?.rank || "Member"}</span>
                  <span className="text-xs text-gray-500">Current Rank</span>
                </div>

                <div className="flex flex-col items-center p-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(profile?.earnings?.monthly || 0)}</span>
                  <span className="text-xs text-gray-500">Monthly</span>
                </div>

                <div className="flex flex-col items-center p-2">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mb-2">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-lg font-bold">{profile?.joinDate || "2023"}</span>
                  <span className="text-xs text-gray-500">Joined</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="info" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Name:</span>
                    <span>{profile?.displayName || user?.displayName || "User"}</span>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Email:</span>
                    <span>{profile?.email || user?.email || "email@example.com"}</span>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Phone:</span>
                    <span>{user?.phoneNumber || "Not set"}</span>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Location:</span>
                    <span>Philippines</span>
                  </div>

                  <Button className="w-full mt-2" onClick={() => alert("Edit profile")}>
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Total Earnings:</span>
                      <span className="font-bold">{formatCurrency(profile?.earnings?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">This Month:</span>
                      <span className="font-bold">{formatCurrency(profile?.earnings?.monthly || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">This Week:</span>
                      <span className="font-bold">{formatCurrency(profile?.earnings?.weekly || 0)}</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <Button className="w-full" onClick={() => router.push("/finance")}>
                        View Detailed Earnings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Team Size:</span>
                      <span className="font-bold">{profile?.team?.size || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Direct Recruits:</span>
                      <span className="font-bold">{profile?.team?.directRecruits || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Active Members:</span>
                      <span className="font-bold">{profile?.team?.activeMembers || 0}</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <Button className="w-full" onClick={() => router.push("/community")}>
                        View Team Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-xs text-gray-500">
            <p>Member since {profile?.joinDate || "2023"}</p>
            <p>© 2025 Team Magnetar. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

