import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, ban } = await req.json();
  if (typeof ban !== "boolean" || !userId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await db.user.update({ where: { id: userId }, data: { banned: ban } });
  return NextResponse.json({ ok: true });
}
