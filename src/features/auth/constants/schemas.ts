import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().includes('@', { message: 'Email must contain @ symbol' }).email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(/^[A-Z]/, { message: 'Password must start with a capital letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special symbol' }),
});

export type RegisterValues = z.infer<typeof registerSchema>;

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

