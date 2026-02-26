import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, { message: "username must be minimun 2 charecter long" })
    .max(20, { message: "username must be maximum 20 cahrecter long" })
    .regex(
      /[a-zA-Z][a-zA-Z0-9-_]{2,20}/gi,
      "special charercter is not valid for username",
    ),
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(6, { message: "password must be 6 charecter long" }),
});