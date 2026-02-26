import {z} from "zod"

export const signInSchema = z.object({
    usrename:z.string(),
    password:z.string()
})