import { z } from "zod";

export const CategoriesInputSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const CategoriesPatchInputSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const ProductsInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().transform((value) => String(value)),
  stock_quantity: z.number().transform((value) => String(value)),
});

export const ProductsPatchInputSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .number()
    .optional()
    .transform((value) => String(value)),
  stock_quantity: z
    .number()
    .optional()
    .transform((value) => String(value)),
});
