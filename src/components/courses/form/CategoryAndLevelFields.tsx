
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import schema from a centralized location
import { courseFormSchema } from "./CourseFormSchema";

type FormValues = z.infer<typeof courseFormSchema>;

interface CategoryAndLevelFieldsProps {
  form: UseFormReturn<FormValues>;
  isDark: boolean;
}

export function CategoryAndLevelFields({ form, isDark }: CategoryAndLevelFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="ai">AI & Machine Learning</SelectItem>
                <SelectItem value="mobile">Mobile Development</SelectItem>
                <SelectItem value="cloud">Cloud Computing</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The main subject area of your course
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Difficulty Level</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={isDark ? "bg-gray-800 border-gray-700 text-white" : ""}>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The skill level required for this course
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
