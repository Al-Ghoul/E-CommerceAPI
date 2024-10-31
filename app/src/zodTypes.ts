import { z } from "zod";

export const CategoriesInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const CategoriesPatchInputSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const SubCategoriesInputSchema = z.object({
  name: z.string(),
  description: z.string(),
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

export const RegisterInputSchema = z.object({
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

export const RegisterInputClientSchema = RegisterInputSchema.extend({
  confirmPassword: z
    .string({
      required_error: "Confirm Password is required",
      invalid_type_error: "Confirm Password must be a string",
    })
    .min(8, "Password must be at least 8 characters"),
}).superRefine((val, ctx) => {
  if (val.password != val.confirmPassword)
    ctx.addIssue({
      code: "custom",
      message: "Passwords do NOT match.",
      path: ["confirmPassword"],
    });
});

export type RegisterInputClientSchemaType = z.infer<
  typeof RegisterInputClientSchema
>;

export type LoginInputClientSchemaType = z.infer<typeof RegisterInputSchema>;

export const CartItemInputSchema = z.object({
  product_id: z.string(),
  quantity: z.number(),
});

export type CartItemInputSchemaType = z.infer<typeof CartItemInputSchema>;
