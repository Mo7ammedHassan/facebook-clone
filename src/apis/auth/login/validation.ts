import z from "zod";

// export const loginSchema = z.object({
//     email: z.string().email().min(1),
//     password: z.string().min(1),
// });

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// const passwordRegex = /^(?=(?:\d*[a-zA-Z])\d*$)[a-zA-Z0-9]{8}$/;

export const loginSchema = z.object({
    email: z.string().trim().min(1).toLowerCase().regex(emailRegex,{error:"email not valid"}),

    password: z
    .string().trim().min(1)
})