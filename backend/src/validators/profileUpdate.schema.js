import { z } from "zod";

const profileUpdateSchema = z.object({
    userName: z
        .string()
        .min(4, { message: "Username should be at least 4 characters" })
        .max(10, { message: "Username should be at most 10 characters" })
        .trim()
        .optional(),

    fullName: z
        .string()
        .min(4, { message: "Full name should be at least 4 characters" })
        .max(30, { message: "Full name should be at most 30 characters" })
        .trim()
        .optional(),

    bio: z.string().max(150, { message: "Bio should be at most 150 characters" }).trim().optional(),  // Bio is optional

    profileImage: z
        .any()
        .refine((file) => !file || (file && file.mimetype?.startsWith("image/")), {
            message: "Profile image must be a valid image file",
        })
        .optional(),

    coverImage: z
        .any()
        .refine((file) => !file || (file && file.mimetype?.startsWith("image/")), {
            message: "Cover image must be a valid image file",
        })
        .optional(),
});

export { profileUpdateSchema };
