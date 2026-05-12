"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Send, Paperclip, Smile, ArrowLeft, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  read: boolean;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar: string | null };
}

interface Conversation {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  read: boolean;
  createdAt: Date;
  sender: { id: string; name: string | null; avatar: string | null };
  receiver: { id: string; name: string | null; avatar: string | null };
  listing: { id: string; title: string };
}

interface Props {
  currentUserId: string;
  conversations: Conversation[];
  thread: Message[];
  activeListingId?: string;
  activeOtherId?: string;
  activeListingTitle?: string | null;
}

function Avatar({ name, avatar, size = 10 }: { name: string | null; avatar: string | null; size?: number }) {
  if (avatar) return <Image src={avatar} alt="" width={size * 4} height={size * 4} className={`rounded-full w-${size} h-${size} object-cover flex-shrink-0`} />;
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-semibold text-xs">{(name ?? "?")[0].toUpperCase()}</span>
    </div>
  );
}

export function MessagesClient({ currentUserId, conversations, thread: initialThread, activeListingId, activeOtherId, activeListingTitle }: Props) {
  const [thread, setThread] = useState(initialThread);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showList, setShowList] = useState(!activeListingId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageTime = useRef<string | null>(
    initialThread.length > 0 ? new Date(initialThread[initialThread.length - 1].createdAt).toISOString() : null
  );

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread]);

  // Poll for new messages every 5 seconds when a conversation is open
  useEffect(() => {
    if (!activeListingId || !activeOtherId) return;
    const poll = async () => {
      const params = new URLSearchParams({ listingId: activeListingId, otherId: activeOtherId });
      if (lastMessageTime.current) params.set("after", lastMessageTime.current);
      const res = await fetch(`/api/messages/thread?${params}`);
      if (!res.ok) return;
      const newMsgs: Message[] = await res.json();
      if (newMsgs.length > 0) {
        setThread((prev) => [...prev, ...newMsgs]);
        lastMessageTime.current = new Date(newMsgs[newMsgs.length - 1].createdAt).toISOString();
      }
    };
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [activeListingId, activeOtherId]);

  const sendMessage = async () => {
    if (!message.trim() || !activeListingId || !activeOtherId) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: activeListingId, receiverId: activeOtherId, content: message.trim() }),
    });
    if (res.ok) {
      const newMsg = await res.json();
      setThread((prev) => [...prev, newMsg]);
      lastMessageTime.current = new Date(newMsg.createdAt).toISOString();
      setMessage("");
    }
    setSending(false);
  };

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const getUnreadCount = (conv: Conversation) =>
    !conv.read && conv.senderId !== currentUserId ? 1 : 0;

  const getOther = (conv: Conversation) =>
    conv.senderId === currentUserId ? conv.receiver : conv.sender;

  return (
    <div className="bg-gray-50 h-[calc(100vh-64px)] flex">
      {/* Conversation list */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col",
        "md:flex",
        showList ? "flex" : "hidden md:flex"
      )}>
        <div className="px-4 py-4 border-b border-gray-100">
          <h1 className="font-bold text-gray-900 text-lg">Messages</h1>
          <p className="text-xs text-gray-500 mt-0.5">{conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
        </div>

        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-blue-400" />
            </div>
            <p className="font-medium text-gray-700">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Browse rooms and contact landlords to get started.</p>
            <Link href="/listings" className="btn-primary mt-4 text-xs">Browse Rooms</Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {conversations.map((conv) => {
              const other = getOther(conv);
              const unread = getUnreadCount(conv);
              const isActive = conv.listingId === activeListingId;
              return (
                <Link
                  key={conv.id}
                  href={`/dashboard/messages?listingId=${conv.listingId}&landlordId=${other.id}`}
                  onClick={() => setShowList(false)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors",
                    isActive && "bg-blue-50 hover:bg-blue-50"
                  )}
                >
                  <div className="relative">
                    <Avatar name={other.name} avatar={other.avatar} size={10} />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-sm text-gray-900 truncate">{other.name ?? "User"}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatDistanceToNow(new Date(conv.createdAt), { addSuffix: false })} ago
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.listing.title}</p>
                    <p className={cn("text-xs truncate mt-0.5", unread > 0 ? "text-gray-900 font-medium" : "text-gray-400")}>
                      {conv.content}
                    </p>
                  </div>
                  {unread > 0 && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{unread}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat panel */}
      <div className={cn(
        "flex-1 flex flex-col",
        showList ? "hidden md:flex" : "flex"
      )}>
        {activeListingId && activeOtherId ? (
          <>
            {/* Chat header */}
            <div className="px-4 py-3.5 border-b border-gray-200 bg-white/80 backdrop-blur-xl flex items-center gap-3">
              <button onClick={() => setShowList(true)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <p className="text-xs text-gray-400">About:</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{activeListingTitle}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
              {thread.map((msg) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
                    {!isMine && <Avatar name={msg.sender.name} avatar={msg.sender.avatar} size={8} />}
                    <div className={cn("flex flex-col gap-1", isMine ? "items-end" : "items-start")}>
                      <div className={isMine ? "bubble-sent" : "bubble-received"}>{msg.content}</div>
                      <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white/90 backdrop-blur-xl px-4 py-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
                <button className="p-1 text-gray-400 hover:text-gray-600"><Paperclip className="h-4 w-4" /></button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button className="p-1 text-gray-400 hover:text-gray-600"><Smile className="h-4 w-4" /></button>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sending}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-700">Select a conversation</p>
            <p className="text-sm text-gray-500 mt-1">Choose a conversation from the list to read your messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
