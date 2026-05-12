const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const isClerkConfigured =
  Boolean(clerkPublishableKey) &&
  clerkPublishableKey!.startsWith("pk_") &&
  !clerkPublishableKey!.includes("replace_me");

