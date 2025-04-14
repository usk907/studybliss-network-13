
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

// Import schema from a centralized location
import { courseFormSchema } from "./CourseFormSchema";

type FormValues = z.infer<typeof courseFormSchema>;

interface CourseToggleFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function CourseToggleFields({ form }: CourseToggleFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured Course</FormLabel>
              <FormDescription>
                Display this course in the featured section
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="is_popular"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Popular Course</FormLabel>
              <FormDescription>
                Mark this course as popular
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
