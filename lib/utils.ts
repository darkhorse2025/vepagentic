import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function callEmilioAPI(systemPrompt: string, userContent: string): Promise<string> {
  // Mock implementation - replace with actual API call
  console.log("Calling Emilio API with:", { systemPrompt, userContent })
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  return `Response from Emilio: ${userContent} (processed with system prompt: ${systemPrompt})`
}

