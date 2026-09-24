import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num)
}

export function formatPercent(num: number): string {
  return `${(num * 100).toFixed(1)}%`
}

export function formatDaysRemaining(days: number): string {
  if (days <= 0) return "Stocked Out"
  if (days === 1) return "1 day left"
  return `${days} days left`
}
