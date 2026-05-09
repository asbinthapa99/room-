import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { listingId, reportId } = await req.json();

  await db.listing.delete({ where: { id: listingId } });
  if (reportId) await db.report.update({ where: { id: reportId }, data: { resolved: true } });

  return NextResponse.json({ ok: true });
}
