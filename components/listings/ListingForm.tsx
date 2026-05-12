"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { CITIES, ROOM_TYPES, GENDER_PREFS, CURRENCIES } from "@/lib/utils";

const listingSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  currency: z.enum(["GBP", "CAD"]),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  address: z.string().optional(),
  roomType: z.enum(["PRIVATE", "SHARED"]),
  billsIncluded: z.boolean(),
  availableDate: z.string().min(1, "Available date is required"),
  genderPref: z.enum(["MALE", "FEMALE", "ANY"]),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialData?: Partial<ListingFormData> & { id?: string; images?: string[] };
}

export function ListingForm({ initialData }: ListingFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      currency: "GBP",
      roomType: "PRIVATE",
      billsIncluded: false,
      genderPref: "ANY",
      ...initialData,
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    if (images.length === 0) {
      setError("Please upload at least one photo.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const url = initialData?.id ? `/api/listings/${initialData.id}` : "/api/listings";
    const method = initialData?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, images }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/listings");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
              <Image src={url} alt={`Room photo ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-white/90 hover:bg-white shadow-sm"
              >
                <X className="h-3 w-3 text-gray-600" />
              </button>
            </div>
          ))}
          {images.length < 8 && (
            <CldUploadWidget
              uploadPreset="roomrent_listings"
              onSuccess={(result) => {
                const info = result.info as { secure_url?: string } | undefined;
                if (info?.secure_url) {
                  setImages((prev) => [...prev, info.secure_url!]);
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-brand-500 hover:bg-brand-50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-xs text-gray-500">Upload</span>
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>
        <p className="text-xs text-gray-500">Upload up to 8 photos. First photo is the cover image.</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input {...register("title")} className="input-field" placeholder="e.g. Bright private room near Zone 2 tube" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={5}
          className="input-field resize-none"
          placeholder="Describe the room, house, neighbourhood, transport links, house rules..."
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Price + currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Rent <span className="text-red-500">*</span>
          </label>
          <input {...register("price")} type="number" className="input-field" placeholder="700" min={1} />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select {...register("currency")} className="input-field">
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* City + Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select {...register("city")} className="input-field">
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select {...register("country")} className="input-field">
            <option value="">Select country</option>
            <option value="UK">United Kingdom</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address / Area</label>
        <input {...register("address")} className="input-field" placeholder="e.g. Hackney, East London (avoid full address for privacy)" />
      </div>

      {/* Room type + gender pref */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
          <select {...register("roomType")} className="input-field">
            {ROOM_TYPES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
          <select {...register("genderPref")} className="input-field">
            {GENDER_PREFS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Available date + bills */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available From <span className="text-red-500">*</span>
          </label>
          <input {...register("availableDate")} type="date" className="input-field" />
          {errors.availableDate && <p className="mt-1 text-xs text-red-500">{errors.availableDate.message}</p>}
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register("billsIncluded")}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700">Bills included in rent</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-primary flex-1 gap-2">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData?.id ? "Save Changes" : "Submit Listing"}
        </button>
      </div>
    </form>
  );
}
