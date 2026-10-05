/**
 * Utilities for Persian and English number conversions.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS_OFFSET = 1632;
const PERSIAN_DIGITS_OFFSET = 1776;

/**
 * Converts any standard Latin (0-9) or Arabic-Indic (٠-٩) digits to Persian digits (۰-۹).
 */
export function toPersianDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[0-9]/g, (char) => PERSIAN_DIGITS[Number(char)])
    .replace(/[٠-٩]/g, (char) => PERSIAN_DIGITS[char.charCodeAt(0) - ARABIC_DIGITS_OFFSET]);
}

/**
 * Converts Persian or Arabic digits to standard Latin digits (0-9).
 */
export function toEnglishDigits(value: string | null | undefined): string {
  if (!value) return "";
  return String(value)
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - PERSIAN_DIGITS_OFFSET))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - ARABIC_DIGITS_OFFSET));
}

/**
 * Formats a number or string representation of a number according to the target locale.
 */
export function formatLocaleNumber(
  value: string | number | null | undefined,
  locale: "fa" | "en"
): string {
  if (locale === "fa") {
    return toPersianDigits(value);
  }
  return toEnglishDigits(value != null ? String(value) : "");
}
