
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

// Import schema from a centralized location
import { courseFormSchema } from "./CourseFormSchema";

type FormValues = z.infer<typeof courseFormSchema>;

interface MediaAndDurationFieldsProps {
  form: UseFormReturn<FormValues>;
  isDark: boolean;
}

export function MediaAndDurationFields({ form, isDark }: MediaAndDurationFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Image URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://example.com/image.jpg"
                {...field}
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
              />
            </FormControl>
            <FormDescription>
              A URL to an image that represents your course
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 120"
                {...field}
                className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}
              />
            </FormControl>
            <FormDescription>
              The estimated time to complete the course
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
