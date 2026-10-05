import { z } from "zod";
import { sanitizeString } from "@/lib/sanitize";

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .transform((val) => sanitizeString(val)),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Email is too short")
    .max(255, "Email must not exceed 255 characters")
    .email("Please provide a valid email address"),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters long")
    .max(3000, "Message must not exceed 3000 characters")
    .transform((val) => sanitizeString(val)),
  // Honeypot field for bot spam prevention. Must be empty.
  honeypot: z.string().optional().default(""),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
