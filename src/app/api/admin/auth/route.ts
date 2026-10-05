import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  DEFAULT_ADMIN_SECRET,
  verifyAdminRequest,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret } = body;

    const expectedSecret = process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;

    if (!secret || typeof secret !== "string" || secret.trim() !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid admin secret key." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, expectedSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
    });
  } catch (error) {
    console.error("[ADMIN_AUTH_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const isAuthenticated = await verifyAdminRequest(req);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("[ADMIN_LOGOUT_ERROR]", error);
    return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
  }
}
