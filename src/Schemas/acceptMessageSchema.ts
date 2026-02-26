import {z} from "zod"

export const acceptMessageSchema = z.object({
    isacceptMessage:z.boolean()
})