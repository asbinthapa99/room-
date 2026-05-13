import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await db.user.findUnique({ where: { clerkId }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "pending" | "approved" | "rented" | null
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status === "pending") { where.approved = false; where.rented = false; }
  else if (status === "approved") { where.approved = true; where.rented = false; }
  else if (status === "rented") { where.rented = true; }
  if (search) where.title = { contains: search, mode: "insensitive" };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { landlord: { select: { id: true, name: true, email: true } } },
    }),
    db.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    pagination: { page, limit, totalPages: Math.ceil(total / limit) },
  });
}
