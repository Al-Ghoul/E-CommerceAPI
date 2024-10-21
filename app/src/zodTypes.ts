import { z } from "zod";

export const CategoriesInputSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const ProductsInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().transform((value) => String(value)),
  stock_quantity: z.number().transform((value) => String(value)),
});
