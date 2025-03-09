"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, LogOut, Lock, Globe, Bell, Shield, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { logout, user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (!mounted) return null

  return (
    <div className="pb-16">
      <header className="app-header">
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="p-4 content-area">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription className="text-text-secondary">Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-2">
                <Avatar className="h-24 w-24">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold">John Smith</h2>
              <p className="text-sm text-text-secondary">Software Engineer</p>
            </div>

            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="preferences" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch id="sms-notifications" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Language</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>English (US)</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-visibility">Public Profile</Label>
                  <Switch id="profile-visibility" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-online-status">Show Online Status</Label>
                  <Switch id="show-online-status" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-activity">Show Activity Status</Label>
                  <Switch id="show-activity" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Data & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Terms of Service
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Data Download
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Subscription Management
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-text-secondary">
          <p>VEPP v1.0.0</p>
          <p>© 2025 VEPP Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

