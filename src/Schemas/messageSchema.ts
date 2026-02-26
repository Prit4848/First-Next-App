import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(6, "content must be atlist 6 chatercter long")
    .max(300, "content must be no longer than 300 charecters"),
});
