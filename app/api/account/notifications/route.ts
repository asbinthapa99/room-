import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  emailNotifications: z.boolean().optional(),
  messageAlerts: z.boolean().optional(),
  listingAlerts: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await db.user.update({
    where: { clerkId },
    data: parsed.data,
    select: { emailNotifications: true, messageAlerts: true, listingAlerts: true },
  });

  return NextResponse.json(user);
}
