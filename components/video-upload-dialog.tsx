"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Video, Loader2 } from "lucide-react"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { ref, push, set } from "firebase/database"
import { storage, database } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Progress } from "@/components/ui/progress"

interface VideoUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "social" | "course"
  onSuccess?: (videoUrl: string, data: any) => void
}

export function VideoUploadDialog({ open, onOpenChange, type, onSuccess }: VideoUploadDialogProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(type === "course" ? "Sales Mastery" : "")
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedVideo(file)

      // Create preview
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
    }
  }

  const removeSelectedVideo = () => {
    setSelectedVideo(null)
    setVideoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!selectedVideo || !user) return

    try {
      setUploading(true)
      setProgress(0)

      // Create a reference to the storage location
      const videoRef = storageRef(storage, `videos/${type}/${user.uid}/${Date.now()}_${selectedVideo.name}`)

      // Upload the video
      const uploadTask = uploadBytes(videoRef, selectedVideo)

      // Set progress to 50% after upload starts
      setProgress(50)

      await uploadTask

      // Get the download URL
      const videoUrl = await getDownloadURL(videoRef)
      setProgress(75)

      // Save to database based on type
      if (type === "social") {
        const postsRef = ref(database, "posts")
        const newPostRef = push(postsRef)

        await set(newPostRef, {
          user: {
            name: user.displayName || "Anonymous User",
            initials: user.displayName ? user.displayName.charAt(0) : "A",
            uid: user.uid,
          },
          content: description,
          video: videoUrl,
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: [],
        })
      } else if (type === "course") {
        // For course videos, save to a separate videos collection
        const videosRef = ref(database, "videos")
        const newVideoRef = push(videosRef)

        const videoData = {
          title: title || "Untitled Video",
          description,
          category,
          videoUrl,
          thumbnail: "/placeholder.svg",
          duration: "0:00", // This would be calculated from the actual video
          uploadedBy: user.uid,
          uploadedAt: new Date().toISOString(),
        }

        await set(newVideoRef, videoData)

        if (onSuccess) {
          onSuccess(videoUrl, videoData)
        }
      }

      setProgress(100)
      setUploading(false)
      setTitle("")
      setDescription("")
      setSelectedVideo(null)
      setVideoPreview(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error uploading video:", error)
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "social" ? "Share a Video" : "Upload Course Video"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {type === "course" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Sales Mastery">Sales Mastery</option>
                  <option value="Recruitment Strategies">Recruitment Strategies</option>
                  <option value="Product Training">Product Training</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="video" className="text-right">
              Video
            </Label>
            <div className="col-span-3">
              {!videoPreview ? (
                <div
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2 flex text-sm text-gray-600">
                    <label
                      htmlFor="video-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                    >
                      <span>Upload a video</span>
                      <input
                        id="video-upload"
                        ref={fileInputRef}
                        name="video-upload"
                        type="file"
                        accept="video/*"
                        className="sr-only"
                        onChange={handleVideoChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">MP4, WebM, or Ogg up to 100MB</p>
                </div>
              ) : (
                <div className="relative">
                  <video src={videoPreview} controls className="w-full h-auto rounded-md" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeSelectedVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div className="col-span-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!selectedVideo || uploading || (type === "course" && !title)}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

