import z from 'zod';
export const signupSchema = z.object({
    name: z.string().trim().min(3).max(50),
    email: z.string({ required_error: "email is required" }).trim().toLowerCase().email(),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be String", }).min(8, { message: "Must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
})
export const loginSchema = z.object({
    email: z.string({ required_error: "email is required" }).trim().toLowerCase().email(),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be String", }).min(8, { message: "Must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
})