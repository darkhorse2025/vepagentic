"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip } from "lucide-react"
import { ref, push, set, onValue, serverTimestamp } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderInitials: string
  text: string
  timestamp: number
}

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: {
    id: string
    name: string
    avatar?: string
    initials: string
  }
}

export function ChatDialog({ open, onOpenChange, member }: ChatDialogProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate a unique chat ID based on the two user IDs
  const getChatId = () => {
    if (!user) return null
    const ids = [user.uid, member.id].sort()
    return `${ids[0]}_${ids[1]}`
  }

  const chatId = getChatId()

  useEffect(() => {
    if (!chatId) return

    const messagesRef = ref(database, `chats/${chatId}/messages`)

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messagesArray = Object.entries(data).map(([id, message]: [string, any]) => ({
          id,
          ...message,
        }))

        // Sort by timestamp
        messagesArray.sort((a, b) => a.timestamp - b.timestamp)

        setMessages(messagesArray)
      }
    })

    return () => unsubscribe()
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user || !chatId) return

    try {
      setLoading(true)

      const messagesRef = ref(database, `chats/${chatId}/messages`)
      const newMessageRef = push(messagesRef)

      await set(newMessageRef, {
        senderId: user.uid,
        senderName: user.displayName || "Anonymous User",
        senderInitials: user.displayName ? user.displayName.charAt(0) : "A",
        text: newMessage,
        timestamp: serverTimestamp(),
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: number) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <span>{member.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-8">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = user?.uid === message.senderId

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>{message.senderInitials}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUser ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="rounded-full" disabled={!newMessage.trim() || loading}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

