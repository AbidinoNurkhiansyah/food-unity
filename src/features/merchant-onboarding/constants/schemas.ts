import * as z from "zod";

export const onboardingSchema = z.object({
  businessName: z.string().optional(),
  merchantType: z.string().min(1, "Silakan pilih tipe donor/merchant Anda."),
  phoneNumber: z
    .string()
    .min(8, "Nomor kontak minimal terdiri dari 8 digit.")
    .max(15, "Nomor kontak maksimal terdiri dari 15 digit.")
    .regex(/^[0-9+]+$/, "Format nomor kontak hanya boleh angka dan +"),
  detailAddress: z
    .string()
    .min(
      10,
      "Alamat detail minimal 10 karakter (masukkan nama jalan, RT/RW, no rumah)."
    ),
  locationNotes: z.string().optional(),
  pickupHours: z
    .string()
    .min(1, "Silakan isi jam pengambilan makanan surplus."),
  description: z.string().optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
