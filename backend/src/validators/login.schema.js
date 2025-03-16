import { z } from "zod";

const loginSchema = z.object({
    email: z
        .string({ required_error: "email is required" })
        .email({ message: "invaild email adress" })
        .min(4, { message: "email at least 4 characaters" })
        .max(40, { message: "email maximun 40 characters" })
        .trim(),
    password: z
        .string({ required_error: "password is required" })
        .min(6, { message: "password at least 6 characaters" })
        .max(15, { message: "password maximun 15 characters" })
        .trim(),
})

export {loginSchema}