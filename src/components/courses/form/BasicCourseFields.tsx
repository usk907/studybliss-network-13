
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Import schema from a centralized location
import { courseFormSchema } from "./CourseFormSchema";

type FormValues = z.infer<typeof courseFormSchema>;

interface BasicCourseFieldsProps {
  form: UseFormReturn<FormValues>;
  isDark: boolean;
}

export function BasicCourseFields({ form, isDark }: BasicCourseFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Introduction to Web Development"
                {...field}
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
              />
            </FormControl>
            <FormDescription>
              A clear, descriptive title for your course
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what students will learn in this course"
                className={`min-h-32 ${isDark ? "bg-gray-800 border-gray-700 text-white" : ""}`}
                {...field}
              />
            </FormControl>
            <FormDescription>
              A detailed description of the course content and objectives
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
