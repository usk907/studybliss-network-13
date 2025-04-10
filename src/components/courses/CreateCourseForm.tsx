
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCourse, CreateCourseData } from "@/hooks/useCreateCourse";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional(),
  duration: z.coerce.number().positive().optional(),
  level: z.string().min(1, { message: "Please select a difficulty level" }),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
});

export function CreateCourseForm() {
  const { createCourse, isLoading } = useCreateCourse();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);
  const isDark = theme === "dark";
  
  // Check if user has admin privileges
  useEffect(() => {
    if (!isAdmin) {
      setUnauthorized(true);
      toast.error("Only administrators can create courses");
    }
  }, [isAdmin]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", // This is required, so we initialize with empty string
      description: "",
      category: "",
      image_url: "",
      level: "",
      is_featured: false,
      is_popular: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAdmin) {
      toast.error("Only administrators can create courses");
      return;
    }
    
    // Ensure all required fields are present in courseData
    const courseData: CreateCourseData = {
      title: values.title, // Explicitly include required fields
      description: values.description,
      category: values.category,
      level: values.level,
      image_url: values.image_url,
      duration: values.duration,
      is_featured: values.is_featured,
      is_popular: values.is_popular,
    };
    
    const result = await createCourse(courseData);
    if (result) {
      navigate("/courses");
    }
  };

  if (unauthorized) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <ShieldAlert className="w-12 h-12 text-red-500 dark:text-red-400" />
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Access Denied</h3>
        <p className="text-gray-600 dark:text-gray-300">
          You don't have permission to create courses. Only administrators can perform this action.
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/courses")}
        >
          Return to Courses
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/courses")}
            className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isLoading || !isAdmin}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
