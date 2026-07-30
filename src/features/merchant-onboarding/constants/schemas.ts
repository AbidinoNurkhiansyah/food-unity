import * as z from "zod";

export const onboardingSchema = z.object({
  businessName: z.string().optional(),
  merchantType: z.string().min(1, "Please select your donor/merchant type."),
  phoneNumber: z
    .string()
    .min(8, "Contact number must consist of at least 8 digits.")
    .max(15, "Contact number must consist of at most 15 digits.")
    .regex(/^[0-9+]+$/, "Contact number format can only contain numbers and +"),
  detailAddress: z
    .string()
    .min(
      10,
      "Detailed address must be at least 10 characters (enter street name, RT/RW, house number)."
    ),
  locationNotes: z.string().optional(),
  pickupHours: z
    .string()
    .min(1, "Please enter the pickup hours for surplus food."),
  description: z.string().optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
