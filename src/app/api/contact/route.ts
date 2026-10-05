import { NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/validations/contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Rate limiting check (50 messages per hour per IP)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 50, 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      const minutesLeft = Math.max(1, Math.ceil(rateLimit.resetSeconds / 60));
      return NextResponse.json(
        {
          error: `Too many requests. Limit is 50 messages per hour. Please wait ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} before sending another message.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Parse request JSON body safely
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload in request." },
        { status: 400 }
      );
    }

    // 3. Validate and sanitize input with Zod
    const validationResult = contactMessageSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors).flat()[0] || "Invalid submission data.";

      return NextResponse.json(
        {
          error: firstErrorMessage,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = validationResult.data;

    // 4. Honeypot check: If bot filled the hidden honeypot field, silently simulate success
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Thank you for reaching out!",
        },
        { status: 201 }
      );
    }

    // 5. Save message to PostgreSQL using Prisma
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        isRead: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        data: savedMessage,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error);

    return NextResponse.json(
      {
        error: "Something went wrong while submitting your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
