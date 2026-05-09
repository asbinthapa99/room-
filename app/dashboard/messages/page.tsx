import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { MessagesClient } from "@/components/messages/MessagesClient";

async function getConversations(userId: string) {
  const messages = await db.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
      receiver: { select: { id: true, name: true, avatar: true } },
      listing: { select: { id: true, title: true } },
    },
  });

  const seen = new Set<string>();
  const conversations: typeof messages = [];
  for (const msg of messages) {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const key = `${msg.listingId}-${otherId}`;
    if (!seen.has(key)) { seen.add(key); conversations.push(msg); }
  }
  return conversations;
}

async function getThread(userId: string, listingId: string, otherId: string) {
  return db.message.findMany({
    where: {
      listingId,
      OR: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
  });
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string; landlordId?: string }>;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId }, select: { id: true, name: true } });
  if (!user) redirect("/onboarding");

  const params = await searchParams;
  const conversations = await getConversations(user.id);

  let thread: Awaited<ReturnType<typeof getThread>> = [];
  let activeListingId = params.listingId ?? conversations[0]?.listingId;
  let activeOtherId = params.landlordId ?? (conversations[0]
    ? (conversations[0].senderId === user.id ? conversations[0].receiverId : conversations[0].senderId)
    : undefined);

  if (activeListingId && activeOtherId) {
    thread = await getThread(user.id, activeListingId, activeOtherId);
    await db.message.updateMany({
      where: { listingId: activeListingId, senderId: activeOtherId, receiverId: user.id, read: false },
      data: { read: true },
    });
  }

  const activeListing = activeListingId
    ? await db.listing.findUnique({ where: { id: activeListingId }, select: { title: true } })
    : null;

  return (
    <MessagesClient
      currentUserId={user.id}
      conversations={conversations}
      thread={thread}
      activeListingId={activeListingId}
      activeOtherId={activeOtherId}
      activeListingTitle={activeListing?.title}
    />
  );
}
