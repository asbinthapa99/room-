import { PrismaClient, RoomType, GenderPref } from "@prisma/client";

const db = new PrismaClient();

const LANDLORDS = [
  {
    clerkId: "seed_landlord_001",
    email: "james.hartwell@example.com",
    name: "James Hartwell",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    role: "LANDLORD" as const,
  },
  {
    clerkId: "seed_landlord_002",
    email: "priya.sharma@example.com",
    name: "Priya Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    role: "LANDLORD" as const,
  },
  {
    clerkId: "seed_landlord_003",
    email: "marco.bianchi@example.com",
    name: "Marco Bianchi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marco",
    role: "LANDLORD" as const,
  },
];

const LISTINGS = [
  {
    title: "Bright Private Room in Shoreditch Flat Share",
    description:
      "A sunny double bedroom in a modern 3-bed flat in the heart of Shoreditch. Newly refurbished kitchen and bathroom, fast fibre broadband, and a private balcony shared with one flatmate. 5-minute walk to Old Street station (Northern line).\n\nPerfect for young professionals or postgrads. Quiet building, no parties. Bills included — no surprises at the end of the month.",
    price: 1150,
    currency: "GBP",
    city: "London",
    country: "United Kingdom",
    address: "Shoreditch, London E1",
    roomType: RoomType.PRIVATE,
    billsIncluded: true,
    availableDate: new Date("2025-06-01"),
    genderPref: GenderPref.ANY,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 0,
  },
  {
    title: "Cosy Double Room Near Canary Wharf — Bills Incl.",
    description:
      "Well-furnished double room in a quiet 2-bed apartment on the 8th floor with panoramic views of the Thames. 8-minute walk to Canary Wharf DLR & Jubilee line. Ideal for finance or tech professionals.\n\nShared with one other professional tenant. The flat has underfloor heating, a modern kitchen, and a gym in the building. All bills included in rent.",
    price: 1300,
    currency: "GBP",
    city: "London",
    country: "United Kingdom",
    address: "Isle of Dogs, London E14",
    roomType: RoomType.PRIVATE,
    billsIncluded: true,
    availableDate: new Date("2025-06-15"),
    genderPref: GenderPref.ANY,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 1,
  },
  {
    title: "Large Shared Room in Hackney — Great Value",
    description:
      "Spacious shared room (2 beds) in a friendly 5-person house in Hackney. Great for students or newcomers who want to keep costs low while living in one of East London's trendiest areas.\n\nHuge living room, garden access, and a 10-minute cycle to Liverpool Street. Bills not included — average £80/month each. Flexible move-in dates.",
    price: 680,
    currency: "GBP",
    city: "London",
    country: "United Kingdom",
    address: "Hackney, London E8",
    roomType: RoomType.SHARED,
    billsIncluded: false,
    availableDate: new Date("2025-05-20"),
    genderPref: GenderPref.ANY,
    images: [
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 2,
  },
  {
    title: "Modern Private Room in Downtown Toronto — Furnished",
    description:
      "Bright private room in a fully furnished 2-bedroom condo on the 22nd floor in downtown Toronto. Floor-to-ceiling windows, in-suite laundry, concierge, and rooftop terrace access.\n\nWalking distance to Union Station, the Financial District, and the CN Tower. Perfect for new arrivals, students, or short-term professionals. Bills and internet included.",
    price: 1450,
    currency: "CAD",
    city: "Toronto",
    country: "Canada",
    address: "Downtown Toronto, ON M5V",
    roomType: RoomType.PRIVATE,
    billsIncluded: true,
    availableDate: new Date("2025-06-01"),
    genderPref: GenderPref.ANY,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
      "https://images.unsplash.com/photo-1585128792020-803d29415281?w=900&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
      "https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 0,
  },
  {
    title: "Quiet Room in Scarborough Family Home — Female Only",
    description:
      "Clean and comfortable private room in a welcoming family home in Scarborough, East Toronto. Ideal for a female student or professional. Shared kitchen and one bathroom with one other tenant.\n\nClose to Scarborough Town Centre, direct bus to U of T Scarborough campus. TTC monthly pass available nearby. Laundry in building. Utilities not included.",
    price: 950,
    currency: "CAD",
    city: "Toronto",
    country: "Canada",
    address: "Scarborough, Toronto ON M1P",
    roomType: RoomType.PRIVATE,
    billsIncluded: false,
    availableDate: new Date("2025-07-01"),
    genderPref: GenderPref.FEMALE,
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=900&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 1,
  },
  {
    title: "Stylish Studio-Style Room in Brixton — All Bills Incl.",
    description:
      "A beautifully decorated private room with its own mini-kitchenette area in a converted Victorian terrace in Brixton. Feels like a studio but at a flatshare price.\n\nShared bathroom with one other tenant. 4-minute walk to Brixton tube (Victoria line, direct to Oxford Circus in 12 min). Very vibrant neighbourhood — markets, cafes, live music right on your doorstep. Bills and Netflix included.",
    price: 1050,
    currency: "GBP",
    city: "London",
    country: "United Kingdom",
    address: "Brixton, London SW9",
    roomType: RoomType.PRIVATE,
    billsIncluded: true,
    availableDate: new Date("2025-05-25"),
    genderPref: GenderPref.ANY,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=900&q=80",
    ],
    approved: true,
    rented: false,
    landlordIndex: 2,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert landlords
  const landlords = await Promise.all(
    LANDLORDS.map((l) =>
      db.user.upsert({
        where: { clerkId: l.clerkId },
        update: {},
        create: l,
      })
    )
  );
  console.log(`✅ ${landlords.length} landlords created`);

  // Clear existing seed listings to avoid duplicates on re-run
  await db.listing.deleteMany({
    where: {
      landlordId: { in: landlords.map((l) => l.id) },
    },
  });

  // Create listings
  const listings = await Promise.all(
    LISTINGS.map(({ landlordIndex, ...data }) =>
      db.listing.create({
        data: {
          ...data,
          landlordId: landlords[landlordIndex].id,
        },
      })
    )
  );
  console.log(`✅ ${listings.length} listings created`);
  listings.forEach((l) => console.log(`   → ${l.city}: ${l.title}`));

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
