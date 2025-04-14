
import { z } from "zod";

export const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional(),
  duration: z.coerce.number().positive().optional(),
  level: z.string().min(1, { message: "Please select a difficulty level" }),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
