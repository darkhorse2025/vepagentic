"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Eye,
  EyeOff,
  Grid3X3,
  Briefcase,
  GraduationCap,
  Film,
  ShoppingBag,
  MoreHorizontal,
  LogOut,
  BellIcon as Bullhorn,
  Brain,
  FileText,
  Calendar,
  Clock,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/notification-badge"

interface UserData {
  displayName: string
  rank: string
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
  wallet: {
    currency: string
  }
}

export default function Home() {
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(false)

  useEffect(() => {
    if (!user) return

    const userRef = ref(database, `users/${user.uid}`)
    const unsubscribe = onValue(userRef, (snapshot) => {
      setLoading(true)
      const data = snapshot.val()

      if (data) {
        setUserData(data)
      } else {
        // Redirect to profile setup if data doesn't exist
        console.error("User data not found")
        // We could redirect to a profile setup page here
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const quickLinks = [
    {
      icon: <Calendar className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Calendar",
      href: "/calendar",
    },
    {
      icon: <FileText className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Documents",
      href: "/documents",
    },
    {
      icon: <Clock className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Time Off",
      href: "/time-off",
    },
    {
      icon: <Users className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Team",
      href: "/community",
    },
    {
      icon: <Brain className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Persona",
      href: "/persona",
    },
    {
      icon: <Grid3X3 className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Apps",
      href: "/apps",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Finance",
      href: "/finance",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Training",
      href: "/e-learn",
    },
    {
      icon: <Film className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Media",
      href: "/media",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Shop",
      href: "/shop",
    },
    {
      icon: <Bullhorn className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "Announcements",
      href: "/marketer",
    },
    {
      icon: <MoreHorizontal className="w-6 h-6 text-text-primary dark:text-text-primary" />,
      label: "More",
      href: "/more",
    },
  ]

  const recentUsers = [
    { id: "JD", name: "John Doe", color: "bg-indigo-500", href: "/members/1" },
    { id: "JS", name: "Jane Smith", color: "bg-emerald-500", href: "/members/2" },
    { id: "AW", name: "Alice Wong", color: "bg-red-500", href: "/members/3" },
    { id: "BJ", name: "Bob Johnson", color: "bg-amber-500", href: "/members/4" },
    { id: "EG", name: "Eva Green", color: "bg-blue-500", href: "/members/5" },
    { id: "MT", name: "Mike Taylor", color: "bg-purple-500", href: "/members/6" },
  ]

  const handleToggleBalance = () => {
    setShowBalance(!showBalance)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: userData?.wallet?.currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="app-header">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20%286%29-DZ6vnR0zopNGWIz3P4vi35ZwZckQRt.png"
            alt="VEPP Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h1 className="text-xl font-bold">VEPP</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBadge />
          <button className="text-text-primary" onClick={logout}>
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full flex justify-between bg-white border-b border-divider dark:bg-surface dark:border-divider">
          <TabsTrigger
            value="dashboard"
            className="flex-1 py-3 font-medium border-b-2 border-primary data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="flex-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="payroll"
            className="flex-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Payroll
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="flex-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Benefits
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="flex-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="p-4 content-area">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{userData?.displayName || user?.displayName || "Employee"}</h2>
                  <p className="text-text-secondary">{user?.email || "employee@company.com"}</p>
                </div>
                {userData?.rank && (
                  <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
                    {userData.rank}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-4xl font-bold flex items-center">
                  {showBalance ? formatCurrency(userData?.earnings?.total || 0) : "$•••••"}
                  <button className="ml-auto" onClick={handleToggleBalance}>
                    {showBalance ? (
                      <EyeOff className="w-6 h-6 text-text-secondary" />
                    ) : (
                      <Eye className="w-6 h-6 text-text-secondary" />
                    )}
                  </button>
                </h3>
                <p className="text-text-secondary">Current salary</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/time-off" className="btn-primary hover-scale text-center">
                  Request Time Off
                </Link>
                <Link href="/finance" className="btn-primary hover-scale text-center">
                  View Payslips
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {quickLinks.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-3 shadow-sm border border-divider dark:bg-surface dark:border-divider hover-scale hover-shadow"
              >
                <div className="bg-surface rounded-lg p-3 mb-2 dark:bg-[#2A2A2A]">{link.icon}</div>
                <span className="text-xs text-center text-text-secondary">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">Team Members</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
              {recentUsers.map((user) => (
                <Link
                  href={user.href.replace("/members/", "/community/")}
                  key={user.id}
                  className="flex flex-col items-center hover-scale"
                >
                  <div
                    className={`${user.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-1`}
                  >
                    {user.id}
                  </div>
                  <span className="text-xs text-text-secondary">{user.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {userData?.team && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="bg-surface dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">Team Meeting</p>
                      <p className="text-sm text-primary">Today, 2:00 PM</p>
                    </div>
                    <p className="text-sm text-text-secondary">Weekly sprint planning</p>
                  </div>
                  <div className="bg-surface dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">Performance Review</p>
                      <p className="text-sm text-primary">Tomorrow, 10:00 AM</p>
                    </div>
                    <p className="text-sm text-text-secondary">Quarterly evaluation</p>
                  </div>
                  <div className="bg-surface dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium">Company Townhall</p>
                      <p className="text-sm text-primary">Friday, 3:00 PM</p>
                    </div>
                    <p className="text-sm text-text-secondary">Q2 results announcement</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="p-4 content-area">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">My Tasks</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <input type="checkbox" className="mr-3 h-5 w-5 accent-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Complete quarterly report</p>
                      <p className="text-sm text-text-secondary">Due: Today</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 border-0">Urgent</Badge>
                  </div>
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <input type="checkbox" className="mr-3 h-5 w-5 accent-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Review project proposal</p>
                      <p className="text-sm text-text-secondary">Due: Tomorrow</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-0">Medium</Badge>
                  </div>
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <input type="checkbox" className="mr-3 h-5 w-5 accent-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Schedule team building</p>
                      <p className="text-sm text-text-secondary">Due: Next week</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0">Low</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4">Add New Task</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="p-4 content-area">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">Recent Payslips</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">June 2025</p>
                      <p className="text-sm text-text-secondary">Paid on Jun 30, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(5250)}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">May 2025</p>
                      <p className="text-sm text-text-secondary">Paid on May 31, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(5250)}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface rounded-lg">
                    <div>
                      <p className="font-medium">April 2025</p>
                      <p className="text-sm text-text-secondary">Paid on Apr 30, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(5250)}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  View All Payslips
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="p-4 content-area">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">My Benefits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.0 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                      </svg>
                    </div>
                    <h4 className="font-medium">Health Insurance</h4>
                    <p className="text-sm text-text-secondary">Premium plan with dental and vision</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M12 2v20"></path>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <h4 className="font-medium">401(k)</h4>
                    <p className="text-sm text-text-secondary">6% company match</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M9 21V9"></path>
                      </svg>
                    </div>
                    <h4 className="font-medium">Paid Time Off</h4>
                    <p className="text-sm text-text-secondary">20 days remaining</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M2 3h20"></path>
                        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
                        <path d="m7 21 5-5 5 5"></path>
                      </svg>
                    </div>
                    <h4 className="font-medium">Learning Budget</h4>
                    <p className="text-sm text-text-secondary">$1,500 annual allowance</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Benefits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="p-4 content-area">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-3">Performance Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Overall Rating</span>
                      <span className="text-sm text-primary font-medium">4.7/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Goals Completion</span>
                      <span className="text-sm text-primary font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Skills Development</span>
                      <span className="text-sm text-primary font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Recent Feedback</h4>
                  <div className="bg-surface p-3 rounded-lg">
                    <p className="text-sm italic">
                      "Consistently delivers high-quality work and collaborates effectively with team members."
                    </p>
                    <p className="text-xs text-text-secondary mt-1">- Manager, June 15, 2025</p>
                  </div>
                </div>
                <Button className="w-full mt-4">View Full Performance Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

