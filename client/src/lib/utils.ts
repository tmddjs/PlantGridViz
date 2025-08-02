import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes with conditional className handling
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}