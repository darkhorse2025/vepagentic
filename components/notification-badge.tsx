"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { getUnreadNotificationCounts } from "@/lib/notification-service"
import { useAuth } from "@/contexts/auth-context"

export function NotificationBadge() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const checkNotifications = async () => {
      try {
        const counts = await getUnreadNotificationCounts(user.uid)
        setUnreadCount(counts.total)
      } catch (error) {
        console.error("Error getting notification counts:", error)
      }
    }

    checkNotifications()

    // Poll every minute (in a real app, you'd use a real-time listener)
    const interval = setInterval(checkNotifications, 60000)

    return () => clearInterval(interval)
  }, [user])

  return (
    <div className="text-text-primary relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  )
}

