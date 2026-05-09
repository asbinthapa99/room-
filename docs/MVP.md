# MVP Plan — RoomRent

Objective
---------
Validate supply and demand: can renters and landlords actively use the platform? Stop focusing on building a global empire initially.

Primary Focus
-------------
- Audience: Students and newcomers moving abroad mobile frist fesign 1111111
- Initial Launch Cities: London (UK) and Toronto (Canada)
- Later Expansion: Australia, Nepal connections/community

Features
---------------------------
1. **User Authentication:** Google + email, simple selection (renter or landlord)
2. **Room Listings:** photos, title, description, price, location, private/shared, bills included, available date, gender preference
3. **Search & Filters:** country, city, budget, room type, move-in date
4. **Listing Detail Page:** images, price, map, landlord profile, room details, contact button (must be mobile-friendly/mobile-first)
5. **Messaging:** basic inbox between renter and landlord (no advanced chat needed)
6. **Save Favorites:** bookmark listings to revisit later
7. **Admin Dashboard:** moderate/approve/remove listings, ban users, manage reports
8. **Report Scam Button:** flag fake listings, suspicious landlords, or spam

What NOT to Build Initially
---------------------------
- Payment systems & Escrow
- AI matching or roommate algorithms
- Mobile apps first
- Video calls
- Multilingual support
- Reviews
- Contracts/legal automation

Recommended Tech Stack
----------------------
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend / BaaS:** Supabase (Auth, PostgreSQL DB, Storage, Realtime messaging)
- **Image Storage:** Supabase Storage / Cloudinary
- **Hosting:** Vercel

*(Note: Long-term expansion towards a shared codebase mobile app suggests React Native + Expo, Next.js API routes, Neon PostgreSQL, Prisma, Clerk, Firebase/Expo Notifications).*

Phase 2 — Tenant Tools
-----------------------
- Tenant capabilities: view room details, see bills/utilities, contact landlord, receive rent reminders, upload documents
- Landlord capabilities: manage tenants, send payment reminders, update bills, track occupancy (allow "mark as paid")

Phase 3 — Optional Payments & Scale
----------------------------------
- Integrate Stripe or direct bank transfers only after traction
- Verified landlords, reviews, roommate matching, premium listings, agency integrations, student relocation services, mobile apps

Timeline (Suggested MVP)
------------------------
- **Week 1–2:** UI design, DB schema, authentication
- **Week 3–4:** listings, search/filters, messaging
- **Week 5:** admin panel, reporting system
- **Week 6:** testing + launch

Early Growth Playbook
---------------------
- The hardest part is getting listings early on.
- Manually contact landlords, join Facebook housing groups, onboard student housing providers, partner with small agencies.
- Metrics for validation: 100+ listings, 20+ active landlords, users messaging daily, repeat visitors, organic sharing.

Key Risks
---------
1. **Fake Listings** — require strict moderation & reporting flow
2. **No Supply** — manual onboarding is necessary early
3. **Low Trust** — implement verification later
4. **Too Broad** — avoid 'worldwide' thinking initially, keep geographies narrow (just London & Toronto)
