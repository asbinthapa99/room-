# RoomRent — Trusted Rooms Marketplace

A mobile-first room rental marketplace for students and newcomers moving to **London** and **Toronto**. Verified listings, direct messaging, and a clean glassmorphism UI.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Auth | Clerk (Google + email) |
| Database | Neon PostgreSQL |
| ORM | Prisma (with Neon serverless adapter) |
| Images | Cloudinary |
| Styling | Tailwind CSS + Glassmorphism |
| Hosting | Vercel |

## Features

- **Auth** — Google & email sign-in via Clerk; renter / landlord roles
- **Listings** — photo upload, price, city, room type, bills, gender pref, available date
- **Search & Filters** — country, city, budget, room type, move-in date, bills toggle
- **Listing Detail** — image gallery, sticky price card, contact button, save to favorites
- **Messaging** — split-panel inbox with real-time-style chat
- **Save Favorites** — bookmark listings to revisit
- **Admin Dashboard** — approve/remove listings, manage reports
- **Report Scam** — flag fake listings, suspicious landlords, spam

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) → your project → connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → add endpoint `/api/webhooks/clerk` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [Cloudinary Console](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary Console → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Console → API Keys |

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Cloudinary Setup

1. Log in to [Cloudinary](https://cloudinary.com)
2. Go to **Settings → Upload → Upload Presets**
3. Create a preset named `roomrent_listings` — set it to **Unsigned**

## Clerk Webhook Setup

1. In [Clerk Dashboard](https://dashboard.clerk.com) → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** → paste as `CLERK_WEBHOOK_SECRET`

## Project Structure

```
app/
  page.tsx                  # Homepage (hero + cities + listings)
  listings/
    page.tsx                # Search & filter listings
    [id]/page.tsx           # Listing detail (glassmorphism price card)
  dashboard/
    page.tsx                # User dashboard
    messages/page.tsx       # Split-panel messaging
    saved/page.tsx          # Bookmarked rooms
    listings/
      page.tsx              # My listings
      new/page.tsx          # Post a room form
  admin/page.tsx            # Admin moderation dashboard
  (auth)/
    sign-in/                # Clerk sign-in
    sign-up/                # Clerk sign-up
  onboarding/page.tsx       # Role selection (renter / landlord)
  api/
    listings/               # CRUD listings
    messages/               # Send messages
    saved/                  # Save / unsave
    reports/                # Submit reports
    admin/                  # Approve / remove (admin only)
    webhooks/clerk/         # Clerk user sync
components/
  shared/Navbar.tsx         # Glassmorphism sticky nav
  shared/Footer.tsx
  listings/
    ListingCard.tsx
    ListingForm.tsx
    SearchFilters.tsx
    ContactButton.tsx
    SaveButton.tsx
    ReportButton.tsx
  messages/MessagesClient.tsx
  dashboard/DeleteAccountButton.tsx
  admin/AdminActions.tsx
lib/
  db.ts                     # Prisma + Neon singleton
  cloudinary.ts             # Upload helpers
  utils.ts                  # formatPrice, formatDate, constants
prisma/
  schema.prisma             # Full data model
```

## Database Schema

- `User` — clerkId, email, name, avatar, role (RENTER/LANDLORD/ADMIN), banned
- `Listing` — title, description, price, currency, city, country, roomType, billsIncluded, availableDate, genderPref, images[], approved, rented
- `SavedListing` — userId + listingId (unique pair)
- `Message` — content, sender, receiver, listing, read
- `Report` — reason, details, reporter, listing, resolved

## MVP Launch Checklist

- [ ] Fill in `.env.local` with real keys
- [ ] Run `npm run db:push` to create tables
- [ ] Set up Cloudinary upload preset (`roomrent_listings`, unsigned)
- [ ] Add Clerk webhook endpoint
- [ ] Deploy to Vercel (`vercel --prod`)
- [ ] Manually onboard first 5–10 landlords
- [ ] Make yourself an admin: `UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com'`

## Roadmap

- Phase 2: Tenant dashboard (rent reminders, bills, documents)
- Phase 3: Stripe payments, verified landlords, reviews
- Phase 4: React Native mobile apps
