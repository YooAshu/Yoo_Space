import { z } from "zod";

const registrationSchema = z.object({
    userName: z
        .string({ required_error: "username name is required" })
        .min(4, { message: "username should be at least 4 characaters" })
        .max(10, { message: "username should maximun 10 characters" })
        .trim(),
    fullName: z
        .string({ required_error: "full name is required" })
        .min(4, { message: "full name at least 4 characaters" })
        .max(30, { message: "full name maximun 30 characters" })
        .trim(),
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

export {registrationSchema}