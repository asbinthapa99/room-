import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  title: z.string().min(10),
  description: z.string().min(50),
  price: z.number().positive(),
  currency: z.enum(["GBP", "CAD"]),
  city: z.string().min(1),
  country: z.string().min(1),
  address: z.string().optional(),
  roomType: z.enum(["PRIVATE", "SHARED"]),
  billsIncluded: z.boolean(),
  availableDate: z.string(),
  genderPref: z.enum(["MALE", "FEMALE", "ANY"]),
  images: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user || user.banned) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const listing = await db.listing.create({
    data: { ...parsed.data, availableDate: new Date(parsed.data.availableDate), landlordId: user.id },
  });

  return NextResponse.json(listing, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = { approved: true, rented: false };
  if (searchParams.get("city")) where.city = searchParams.get("city");
  if (searchParams.get("country")) where.country = searchParams.get("country");
  if (searchParams.get("roomType")) where.roomType = searchParams.get("roomType");
  if (searchParams.get("maxPrice")) where.price = { lte: parseFloat(searchParams.get("maxPrice")!) };

  const listings = await db.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { landlord: { select: { name: true, avatar: true } } },
  });

  return NextResponse.json(listings);
}
