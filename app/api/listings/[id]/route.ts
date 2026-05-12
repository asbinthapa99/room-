import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.landlordId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await db.listing.update({
    where: { id },
    data: {
      ...body,
      availableDate: body.availableDate ? new Date(body.availableDate) : undefined,
      approved: false, // edited listings require re-approval
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || (listing.landlordId !== user.id && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
