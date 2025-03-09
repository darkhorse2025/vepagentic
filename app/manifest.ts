import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VEPP - Virtual Employee Portal",
    short_name: "VEPP",
    description: "Virtual Employee Portal for workplace management",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#7ab317",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
    categories: ["business", "productivity", "utilities"],
    screenshots: [
      {
        src: "/screenshot1.png",
        sizes: "1080x1920",
        type: "image/png",
        platform: "android",
        label: "VEPP Home Screen",
      },
      {
        src: "/screenshot2.png",
        sizes: "1080x1920",
        type: "image/png",
        platform: "android",
        label: "VEPP Dashboard",
      },
    ],
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=com.vepp.app",
        id: "com.vepp.app",
      },
      {
        platform: "itunes",
        url: "https://apps.apple.com/app/vepp/id123456789",
      },
    ],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Dashboard",
        url: "/home",
        icons: [{ src: "/shortcuts/home.png", sizes: "96x96" }],
      },
      {
        name: "Team",
        url: "/members",
        icons: [{ src: "/shortcuts/team.png", sizes: "96x96" }],
      },
      {
        name: "Training",
        url: "/e-learn",
        icons: [{ src: "/shortcuts/learn.png", sizes: "96x96" }],
      },
      {
        name: "Documents",
        url: "/documents",
        icons: [{ src: "/shortcuts/documents.png", sizes: "96x96" }],
      },
    ],
  }
}

