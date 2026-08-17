import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z
      .string()
      .max(160, { message: "Bio must not exceed 160 characters" })
      .optional(),

    gender: z
      .enum(["male", "female"], {
        message: "Gender must be either male or female",
      })
      .optional(),

    dateOfBirth: z
      .string()
      .datetime({ message: "Invalid date format. Must be ISO string" })
      .optional()
      .refine(
        (dateStr) => {
          if (!dateStr) return true;
          const dob = new Date(dateStr);
          const age = new Date().getFullYear() - dob.getFullYear();
          return age >= 13;
        },
        { message: "User must be at least 13 years old" },
      ),

    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    school: z.string().max(150).optional(),
    education: z.string().max(150).optional(),
    work: z.string().max(150).optional(),

    isPrivate: z.boolean().optional(),
  }),
});

// export type UpdateProfileDto = z.infer<typeof updateProfileSchema>["body"];
