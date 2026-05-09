import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  listingId: z.string(),
  reason: z.enum(["FAKE_LISTING", "SUSPICIOUS_LANDLORD", "SPAM", "INAPPROPRIATE_CONTENT", "OTHER"]),
  details: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const report = await db.report.create({
    data: { ...parsed.data, reporterId: user.id },
  });

  return NextResponse.json(report, { status: 201 });
}
