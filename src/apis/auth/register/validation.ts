import z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1)
    .toLowerCase()
    .regex(emailRegex, { error: "email not valid" }),

  password: z
    .string().trim()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(passwordRegex, {
      error:
        "Password must be at least 8 characters long and contain at least one letter",
    }),

  confirmPassword: z
    .string().trim()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(passwordRegex, {
      error:
        "Password must be at least 8 characters long and contain at least one letter",
    }),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "الصيغة يجب أن تكون YYYY-MM-DD" })
    .refine(
      (dobString) => {
        const dob = new Date(dobString);
        const today = new Date();

        // حساب فرق السنين الإجمالي
        let age = today.getFullYear() - dob.getFullYear();

        // تعديل الحساب بدقة لو عيد ميلاده لسه مجاش السنة دي
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }

        // الشرط: يجب أن يكون العمر 10 سنوات أو أكثر
        return age >= 10;
      },
      {
        error: "sorry, you must be at least 10 years old to register",
      },
    ),
});
