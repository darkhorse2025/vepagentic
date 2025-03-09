import { ref, push, set, get, update, remove } from "firebase/database"
import { database } from "./firebase"

interface CourseModule {
  title: string
  duration: string
  videoUrl?: string
}

interface Course {
  title: string
  description: string
  thumbnail: string
  duration: string
  category: string
  level: string
  videoUrl?: string
  modules?: CourseModule[]
}

// Create a new course
export async function createCourse(courseData: Course): Promise<string> {
  try {
    const coursesRef = ref(database, "courses")
    const newCourseRef = push(coursesRef)

    await set(newCourseRef, courseData)

    return newCourseRef.key || ""
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

// Get all courses
export async function getAllCourses(): Promise<any[]> {
  try {
    const coursesRef = ref(database, "courses")
    const snapshot = await get(coursesRef)

    if (!snapshot.exists()) {
      return []
    }

    const courses: any[] = []
    const data = snapshot.val()

    for (const [id, course] of Object.entries(data)) {
      courses.push({
        id,
        ...(course as any),
      })
    }

    return courses
  } catch (error) {
    console.error("Error getting courses:", error)
    return []
  }
}

// Get a specific course
export async function getCourse(courseId: string): Promise<any | null> {
  try {
    const courseRef = ref(database, `courses/${courseId}`)
    const snapshot = await get(courseRef)

    if (!snapshot.exists()) {
      return null
    }

    return {
      id: courseId,
      ...snapshot.val(),
    }
  } catch (error) {
    console.error("Error getting course:", error)
    return null
  }
}

// Update a course
export async function updateCourse(courseId: string, updates: Partial<Course>): Promise<boolean> {
  try {
    const courseRef = ref(database, `courses/${courseId}`)
    await update(courseRef, updates)
    return true
  } catch (error) {
    console.error("Error updating course:", error)
    return false
  }
}

// Delete a course
export async function deleteCourse(courseId: string): Promise<boolean> {
  try {
    const courseRef = ref(database, `courses/${courseId}`)
    await remove(courseRef)
    return true
  } catch (error) {
    console.error("Error deleting course:", error)
    return false
  }
}

// Track user course progress
export async function updateCourseProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
  try {
    const progressRef = ref(database, `users/${userId}/courseProgress/${courseId}`)
    await set(progressRef, {
      progress,
      lastUpdated: new Date().toISOString(),
    })
    return true
  } catch (error) {
    console.error("Error updating course progress:", error)
    return false
  }
}

// Get user's course progress
export async function getUserCourseProgress(userId: string): Promise<any> {
  try {
    const progressRef = ref(database, `users/${userId}/courseProgress`)
    const snapshot = await get(progressRef)

    if (!snapshot.exists()) {
      return {}
    }

    return snapshot.val()
  } catch (error) {
    console.error("Error getting course progress:", error)
    return {}
  }
}

