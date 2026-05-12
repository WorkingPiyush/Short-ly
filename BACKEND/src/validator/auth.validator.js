import z from 'zod';
export const signupSchema = z.object({
    name: z.string().trim().min(3).max(50),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})