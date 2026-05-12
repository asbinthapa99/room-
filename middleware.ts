import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-config";

const isPublicRoute = createRouteMatcher([
  "/",
  "/listings(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

let protectedMiddleware: ((req: NextRequest, options?: any) => any) | null = null;

if (isClerkConfigured) {
  protectedMiddleware = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  });
}

export default function middleware(req: NextRequest) {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  // clerkMiddleware requires both (auth, req) context; the second arg can be an empty object.
  return protectedMiddleware ? protectedMiddleware(req, {} as any) : NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
