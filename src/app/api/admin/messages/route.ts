import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // 'all' | 'unread' | 'read'
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Prisma where condition
    const where: any = {};

    if (filter === "unread") {
      where.isRead = false;
    } else if (filter === "read") {
      where.isRead = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    // Today's start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [messages, totalCount, unreadCount, totalAll, todayCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
    ]);

    const total = typeof totalCount === "number" ? totalCount : 0;
    const allTotal = typeof totalAll === "number" ? totalAll : 0;
    const unread = typeof unreadCount === "number" ? unreadCount : 0;
    const todayNum = typeof todayCount === "number" ? todayCount : 0;

    return NextResponse.json({
      messages: messages || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      stats: {
        total: allTotal,
        unread,
        read: Math.max(0, allTotal - unread),
        today: todayNum,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_GET_MESSAGES_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve messages from database.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No message IDs provided." },
        { status: 400 }
      );
    }

    if (action === "markRead") {
      const res = await prisma.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, count: res.count });
    }

    if (action === "markUnread") {
      const res = await prisma.contactMessage.updateMany({
        where: { id: { in: ids } },
        data: { isRead: false },
      });
      return NextResponse.json({ success: true, count: res.count });
    }

    if (action === "delete") {
      const res = await prisma.contactMessage.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, count: res.count });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("[ADMIN_BULK_ACTION_ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to perform bulk action.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
