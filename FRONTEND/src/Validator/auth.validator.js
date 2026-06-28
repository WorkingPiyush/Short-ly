import z from 'zod';
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];


export const signupSchema = z.object({
    name: z.string().trim().min(3).max(50),
    email: z.string({ required_error: "email is required" }).trim().toLowerCase().email(),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be String", }).min(8, { message: "Must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
})
export const loginSchema = z.object({
    email: z.string({ required_error: "email is required" }).trim().toLowerCase().email(),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be String", }).min(8, { message: "Must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
})
export const profileUpdateSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(50, "Name is too long"),
    headline: z.string().max(100).optional(),
    location: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number").optional().or(z.literal('')),
    address: z.string().max(200).optional(),
    homepage: z.preprocess((value) => value === "" ? undefined : value, z.string().url("Invalid URL").optional(),),
    image: z.instanceof(File).nullable().optional().refine((file) => !file || file.size <= MAX_FILE_SIZE, { message: "Image must be smaller than 2MB." })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Only JPG, PNG and WebP images are allowed." }),
})