"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { ref, get } from "firebase/database"
import { auth, database, googleProvider } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { createUserProfile } from "@/lib/database-init"

export interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInAsGuest: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth) {
      console.error("Firebase auth is not initialized")
      setLoading(false)
      return () => {}
    }

    setFirebaseInitialized(true)

    // Only set up auth state listener if Firebase is configured
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser && database) {
        try {
          // Check if user has a profile in the database
          const userRef = ref(database, `users/${currentUser.uid}`)
          const snapshot = await get(userRef)

          if (!snapshot.exists()) {
            // Create user profile if it doesn't exist
            await createUserProfile(currentUser.uid, {
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              isAnonymous: currentUser.isAnonymous,
            })
          }
        } catch (error) {
          console.error("Error checking/creating user profile:", error)
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name if provided
      if (displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
      }

      // Create user profile in database
      await createUserProfile(userCredential.user.uid, {
        displayName: displayName || email.split("@")[0],
        email: email,
        photoURL: "",
        isAnonymous: false,
      })

      router.push("/home")
    } catch (error: any) {
      console.error("Error signing up:", error)

      // Provide more specific error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/home")
    } catch (error: any) {
      console.error("Error signing in:", error)

      // Provide more specific error messages
      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const signInWithGoogle = async () => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      const result = await signInWithPopup(auth, googleProvider)

      // Create or update user profile
      await createUserProfile(result.user.uid, {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        isAnonymous: false,
      })

      router.push("/home")
    } catch (error: any) {
      console.error("Error signing in with Google:", error)

      // Handle specific Firebase auth errors
      if (error.code === "auth/unauthorized-domain") {
        throw new Error(
          "This domain is not authorized for Google authentication. Please use email/password login or try from an authorized domain.",
        )
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const signInAsGuest = async () => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    // Implement retry logic for network issues
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        const result = await signInAnonymously(auth)

        // Create user profile for anonymous user
        await createUserProfile(result.user.uid, {
          displayName: "Guest User",
          email: "",
          photoURL: "",
          isAnonymous: true,
        })

        router.push("/home")
        return
      } catch (error: any) {
        console.error(`Error signing in as guest (attempt ${retryCount + 1}):`, error)

        if (error.code === "auth/network-request-failed") {
          retryCount++

          if (retryCount >= maxRetries) {
            throw new Error("Network connection error. Please check your internet connection and try again later.")
          }

          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
          continue
        }

        throw error
      }
    }
  }

  const resetPassword = async (email: string) => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Error resetting password:", error)

      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const logout = async () => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      await signOut(auth)
      router.push("/login")
    } catch (error: any) {
      console.error("Error logging out:", error)

      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  const updateUserProfile = async (displayName: string) => {
    if (!firebaseInitialized) {
      throw new Error("Firebase is not initialized yet. Please try again in a moment.")
    }

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
        // Force refresh the user object
        setUser({ ...auth.currentUser })
      }
    } catch (error: any) {
      console.error("Error updating profile:", error)

      if (error.code === "auth/network-request-failed") {
        throw new Error("Network connection error. Please check your internet connection and try again.")
      }

      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInAsGuest,
        resetPassword,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

