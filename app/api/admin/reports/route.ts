import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "open"; // "open" | "resolved" | "all"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where =
    filter === "open" ? { resolved: false } :
    filter === "resolved" ? { resolved: true } :
    {};

  const [reports, total] = await Promise.all([
    db.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { title: true } },
        reporter: { select: { name: true } },
      },
    }),
    db.report.count({ where }),
  ]);

  return NextResponse.json({
    reports,
    total,
    pagination: { page, limit, totalPages: Math.ceil(total / limit) },
  });
}
