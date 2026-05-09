import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export const CITIES = [
  { value: "london", label: "London", country: "UK" },
  { value: "toronto", label: "Toronto", country: "Canada" },
] as const;

export const COUNTRIES = [
  { value: "UK", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
] as const;

export const ROOM_TYPES = [
  { value: "PRIVATE", label: "Private Room" },
  { value: "SHARED", label: "Shared Room" },
] as const;

export const GENDER_PREFS = [
  { value: "ANY", label: "Any" },
  { value: "MALE", label: "Male Only" },
  { value: "FEMALE", label: "Female Only" },
] as const;

export const CURRENCIES = [
  { value: "GBP", label: "£ GBP" },
  { value: "CAD", label: "$ CAD" },
] as const;

export const REPORT_REASONS = [
  { value: "FAKE_LISTING", label: "Fake Listing" },
  { value: "SUSPICIOUS_LANDLORD", label: "Suspicious Landlord" },
  { value: "SPAM", label: "Spam" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "OTHER", label: "Other" },
] as const;
