import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes the API base URL by removing trailing slashes and whitespace
 * This prevents double slashes in API endpoints
 * Ensures the URL has a protocol (http:// or https://)
 */
export function getApiBaseUrl() {
  let baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  
  // Trim whitespace
  baseUrl = baseUrl.trim();
  
  // Remove trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, "");
  
  // If URL doesn't start with http:// or https://, add https://
  if (!baseUrl.match(/^https?:\/\//i)) {
    // If it starts with //, replace with https://
    if (baseUrl.startsWith("//")) {
      baseUrl = "https:" + baseUrl;
    } else {
      // Otherwise prepend https://
      baseUrl = "https://" + baseUrl;
    }
  }
  
  return baseUrl;
}
