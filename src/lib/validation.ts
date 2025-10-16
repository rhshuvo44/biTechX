import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    price: z
        .number("Price must be a number")
        .positive("Price must be greater than 0"),
    description: z.string().optional(),
});

export type ProductFormType = z.infer<typeof productSchema>;
