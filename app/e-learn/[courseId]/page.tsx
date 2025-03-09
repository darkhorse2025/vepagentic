"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, FileText, ChevronLeft, BookOpen, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { VideoPlayer } from "@/components/video-player"
import { useAuth } from "@/contexts/auth-context"
// Add imports
import { getCourse, updateCourseProgress } from "@/lib/course-service"

interface CourseModule {
  title: string
  duration: string
  videoUrl?: string
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

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeModule, setActiveModule] = useState<number | null>(null)
  const [isWatching, setIsWatching] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string | null>(null)

  // Update the useEffect to load real course data
  useEffect(() => {
    // Load the specific course
    const loadCourse = async () => {
      setLoading(true)
      try {
        const courseData = await getCourse(courseId)

        if (courseData) {
          setCourse(courseData)

          // If there's a main course video, set it as current
          if (courseData.videoUrl) {
            setCurrentVideoUrl(courseData.videoUrl)
            setCurrentVideoTitle(courseData.title)
          }
        } else {
          // Redirect if course not found
          router.push("/e-learn")
        }
      } catch (error) {
        console.error("Error loading course:", error)
        router.push("/e-learn")
      } finally {
        setLoading(false)
      }
    }

    loadCourse()

    // Get user progress for this course if user is logged in
    if (user) {
      const progressRef = ref(database, `users/${user.uid}/courseProgress/${courseId}`)
      const progressUnsubscribe = onValue(progressRef, (snapshot) => {
        const progressData = snapshot.val()
        if (progressData) {
          setProgress(progressData.progress || 0)
        }
      })

      return () => {
        progressUnsubscribe()
      }
    }
  }, [courseId, router, user])

  // Update the updateProgress function
  const updateProgress = (newProgress: number) => {
    if (!user || !courseId) return

    updateCourseProgress(user.uid, courseId, newProgress).catch((error) =>
      console.error("Error updating progress:", error),
    )
  }

  const handleModuleClick = (index: number) => {
    if (!course?.modules?.[index]) return

    const module = course.modules[index]
    setActiveModule(index)

    if (module.videoUrl) {
      setCurrentVideoUrl(module.videoUrl)
      setCurrentVideoTitle(module.title)
      setIsWatching(true)
    }
  }

  const handleVideoComplete = () => {
    // Calculate new progress
    if (activeModule !== null && course?.modules) {
      const newProgress = Math.min(100, Math.round(((activeModule + 1) / course.modules.length) * 100))
      setProgress(newProgress)
      updateProgress(newProgress)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold truncate">{course.title}</h1>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      <div className="content-area">
        {isWatching && currentVideoUrl ? (
          <div className="mb-4">
            <VideoPlayer
              src={currentVideoUrl}
              title={currentVideoTitle || undefined}
              poster={course.thumbnail}
              onComplete={handleVideoComplete}
            />
            <Button variant="outline" className="mt-2 ml-4" onClick={() => setIsWatching(false)}>
              Back to Course
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={course.thumbnail || "/placeholder.svg"}
              width={800}
              height={450}
              alt={course.title}
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full w-16 h-16 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  if (course.videoUrl) {
                    setCurrentVideoUrl(course.videoUrl)
                    setCurrentVideoTitle(course.title)
                    setIsWatching(true)
                  } else if (course.modules?.[0]?.videoUrl) {
                    setCurrentVideoUrl(course.modules[0].videoUrl)
                    setCurrentVideoTitle(course.modules[0].title)
                    setActiveModule(0)
                    setIsWatching(true)
                  }
                }}
              >
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  width={24}
                  height={24}
                  alt="Play"
                  className="text-primary"
                />
              </Button>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge>{course.level}</Badge>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{course.duration}</span>
            </div>
          </div>

          {!isWatching && (
            <>
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Tabs defaultValue="modules" className="mb-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="space-y-4">
                  {course.modules ? (
                    course.modules.map((module, index) => (
                      <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 rounded-full p-2 mt-1">
                                <span className="text-primary font-medium">{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{module.title}</h3>
                                <p className="text-sm text-gray-500">{module.duration}</p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full"
                              onClick={() => handleModuleClick(index)}
                            >
                              <Image
                                src="/placeholder.svg?height=20&width=20"
                                width={20}
                                height={20}
                                alt="Play"
                                className="h-5 w-5 text-primary"
                              />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No modules available for this course.</p>
                  )}
                </TabsContent>

                <TabsContent value="resources">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Course Slides</h3>
                            <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Practice Worksheets</h3>
                            <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
                            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Additional Reading</h3>
                            <p className="text-sm text-gray-500">PDF • 3.5 MB</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="discussion">
                  <div className="space-y-4">
                    <p className="text-center text-gray-500 py-8">
                      Discussion forum will be available once you start the course.
                    </p>
                    <Button className="w-full">Start Course to Join Discussion</Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    // Find the next unwatched module
                    if (course.modules) {
                      const nextModuleIndex = Math.floor((progress * course.modules.length) / 100)
                      handleModuleClick(nextModuleIndex)
                    } else if (course.videoUrl) {
                      setCurrentVideoUrl(course.videoUrl)
                      setCurrentVideoTitle(course.title)
                      setIsWatching(true)
                    }
                  }}
                >
                  <Image
                    src="/placeholder.svg?height=16&width=16"
                    width={16}
                    height={16}
                    alt="Play"
                    className="mr-2 h-4 w-4"
                  />
                  Continue Learning
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (course.modules?.[0]) {
                      handleModuleClick(0)
                    } else if (course.videoUrl) {
                      setCurrentVideoUrl(course.videoUrl)
                      setCurrentVideoTitle(course.title)
                      setIsWatching(true)
                    }
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start from Beginning
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

