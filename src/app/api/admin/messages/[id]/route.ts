import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { isRead } = body;

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { error: "isRead must be a boolean value." },
        { status: 400 }
      );
    }

    try {
      const updated = await prisma.contactMessage.update({
        where: { id },
        data: { isRead },
      });
      return NextResponse.json({ success: true, message: updated });
    } catch (dbErr: any) {
      if (dbErr.code === "P2025") {
        return NextResponse.json(
          { error: "Message no longer exists in the database." },
          { status: 404 }
        );
      }
      throw dbErr;
    }
  } catch (error: any) {
    console.error("[ADMIN_UPDATE_MESSAGE_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to update message.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;

    try {
      await prisma.contactMessage.delete({
        where: { id },
      });
    } catch (dbErr: any) {
      // If record is already deleted, treat as successful idempotent delete
      if (dbErr.code === "P2025") {
        return NextResponse.json({ success: true, id, alreadyDeleted: true });
      }
      throw dbErr;
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("[ADMIN_DELETE_MESSAGE_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to delete message.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
