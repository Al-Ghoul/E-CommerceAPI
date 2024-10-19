import { z } from "zod";

export const CategoriesInputSchema = z.object({
  name: z.string(),
  description: z.string(),
});
