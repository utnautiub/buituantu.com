import { formatIncompletePhoneNumber } from "@/lib/libphonenumber";

export function decodeEmail(email: string) {
  return atob(email);
}

export function decodePhoneNumber(phone: string) {
  return atob(phone);
}

export function formatPhoneNumber(phone: string) {
  // Custom format for Vietnamese phone numbers: +84 339 10 2003
  // Remove all spaces and non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Check if it's Vietnamese number starting with +84
  if (cleaned.startsWith("+84")) {
    const numbers = cleaned.slice(3); // Remove +84

    // Format: +84 339 10 2003 (3-2-4)
    if (numbers.length === 9) {
      return `+84 ${numbers.slice(0, 3)} ${numbers.slice(3, 5)} ${numbers.slice(5)}`;
    }
  }

  // Fallback to default formatting for other cases
  return formatIncompletePhoneNumber(phone);
}
