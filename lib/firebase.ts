"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app
let auth
let database
let storage
let googleProvider

let isFirebaseConfigured = false

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  database = getDatabase(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()

  isFirebaseConfigured = true

  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Error initializing Firebase:", error)
  // Initialize with null values to prevent further errors
  app = null
  auth = null
  database = null
  storage = null
  googleProvider = null
  isFirebaseConfigured = false
}

export { app, auth, database, storage, googleProvider, isFirebaseConfigured }

