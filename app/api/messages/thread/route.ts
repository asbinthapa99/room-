import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");
  const otherId = searchParams.get("otherId");
  const after = searchParams.get("after");

  if (!listingId || !otherId) {
    return NextResponse.json({ error: "Missing listingId or otherId" }, { status: 400 });
  }

  const messages = await db.message.findMany({
    where: {
      listingId,
      OR: [
        { senderId: user.id, receiverId: otherId },
        { senderId: otherId, receiverId: user.id },
      ],
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });

  // Mark incoming messages as read
  if (messages.length > 0) {
    await db.message.updateMany({
      where: { listingId, senderId: otherId, receiverId: user.id, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json(messages);
}
