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

export const SignUpInputSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters"),
});

