"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Clock, FileText, ChevronRight, BookOpen, Upload, Video } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import Link from "next/link"
import { VideoUploadDialog } from "@/components/video-upload-dialog"
import { useAuth } from "@/contexts/auth-context"
import { getAllCourses, getUserCourseProgress } from "@/lib/course-service"

interface CourseModule {
  title: string
  duration: string
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  category: string
  level: string
  videoUrl?: string
  modules?: CourseModule[]
}

interface VideoItem {
  id: string
  title: string
  description?: string
  videoUrl: string
  thumbnail?: string
  category?: string
  uploadedBy: string
  uploadedAt: string
}

export default function ELearnPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [videoUploadOpen, setVideoUploadOpen] = useState(false)
  const [myVideos, setMyVideos] = useState<VideoItem[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [isWatchingVideo, setIsWatchingVideo] = useState(false)

  const categories = ["All", "Sales Mastery", "Recruitment Strategies", "Product Training", "Marketing", "Leadership"]

  useEffect(() => {
    // Load courses and user progress
    const loadData = async () => {
      setLoading(true)
      try {
        // Get courses from the database
        const allCourses = await getAllCourses()
        setCourses(allCourses)

        // If user is logged in, get their progress
        if (user) {
          const progress = await getUserCourseProgress(user.uid)
          // You could use this progress data to show completion status
        }
      } catch (error) {
        console.error("Error loading courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Also handle videos separately as before
    const videosRef = ref(database, "videos")
    const unsubscribeVideos = onValue(videosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const videosArray = Object.entries(data).map(([id, video]: [string, any]) => ({
          id,
          ...video,
        }))

        // Filter videos to show only user's videos if logged in
        if (user) {
          const userVideos = videosArray.filter((video) => video.uploadedBy === user.uid)
          setMyVideos(userVideos)
        } else {
          setMyVideos([])
        }
      }
    })

    return () => {
      if (unsubscribeVideos) unsubscribeVideos()
    }
  }, [user])

  const handleVideoUploadSuccess = (videoUrl: string, data: any) => {
    // This will be called after a successful video upload
    console.log("Video uploaded successfully:", videoUrl)
  }

  const handleWatchVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsWatchingVideo(true)
  }

  const filteredCourses =
    activeCategory === "All" ? courses : courses.filter((course) => course.category === activeCategory)

  return (
    <div className="pb-16">
      {/* Full width header */}
      <header className="app-header w-full">
        <h1 className="text-xl font-bold">E-Learning Center</h1>
        <Button variant="ghost" size="icon" onClick={() => setVideoUploadOpen(true)} className="ml-auto">
          <Upload className="h-5 w-5" />
        </Button>
      </header>

      <div className="p-4 content-area">
        {isWatchingVideo && selectedVideo ? (
          <div className="mb-4">
            <div className="mb-2">
              <Button variant="outline" onClick={() => setIsWatchingVideo(false)}>
                Back to Courses
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-auto"
                poster={selectedVideo.thumbnail || "/placeholder.svg"}
              />
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
              {selectedVideo.description && <p className="mt-2 text-gray-600">{selectedVideo.description}</p>}
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Uploaded: {new Date(selectedVideo.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar justify-center">
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

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* My Videos Section */}
                {myVideos.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-center">My Videos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                      {myVideos.map((video) => (
                        <Card key={video.id} className="overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                              {video.thumbnail ? (
                                <Image
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  width={350}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Video className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 transition-transform duration-300 hover:scale-110"
                                onClick={() => handleWatchVideo(video)}
                              >
                                <Play className="h-6 w-6 text-primary" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">{video.title || "Untitled Video"}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {video.description || "No description"}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses Section */}
                <h2 className="text-xl font-bold mb-4 text-center">Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {filteredCourses.map((course) => (
                    <Link href={`/e-learn/${course.id}`} key={course.id}>
                      <Card
                        className={`overflow-hidden dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-300 ${
                          hoveredCourse === course.id ? "transform scale-[1.02] shadow-lg" : ""
                        }`}
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                      >
                        <div className="relative">
                          <Image
                            src={course.thumbnail || "/placeholder.svg"}
                            width={600}
                            height={300}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 transition-transform duration-300 hover:scale-110"
                            >
                              <Play className="h-6 w-6 text-primary" />
                            </Button>
                          </div>
                          <Badge className="absolute top-2 right-2">{course.level}</Badge>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{course.duration}</span>
                            <Badge variant="outline" className="ml-2 dark:border-gray-600">
                              {course.category}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{course.description}</p>

                          {course.modules && hoveredCourse === course.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium mb-2 flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                Course Modules
                              </p>
                              <ul className="text-sm text-gray-600 dark:text-gray-300">
                                {course.modules.slice(0, 2).map((module, idx) => (
                                  <li key={idx} className="flex justify-between items-center py-1">
                                    <span>{module.title}</span>
                                    <span className="text-xs text-gray-500">{module.duration}</span>
                                  </li>
                                ))}
                                {course.modules.length > 2 && (
                                  <li className="text-primary text-xs mt-1 flex items-center">
                                    +{course.modules.length - 2} more modules
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button variant="outline" size="sm" className="gap-1 dark:text-gray-300 dark:border-gray-600">
                            <FileText className="w-4 h-4" />
                            Resources
                          </Button>
                          <Button className="gap-1 transition-all duration-300 hover:bg-primary/80">
                            <Play className="w-4 h-4" />
                            Watch Now
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <VideoUploadDialog
        open={videoUploadOpen}
        onOpenChange={setVideoUploadOpen}
        type="course"
        onSuccess={handleVideoUploadSuccess}
      />
    </div>
  )
}

