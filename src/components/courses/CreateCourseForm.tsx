
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useCreateCourse, CreateCourseData } from "@/hooks/useCreateCourse";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Import the form schema
import { courseFormSchema, CourseFormValues } from "./form/CourseFormSchema";

// Import component parts
import { BasicCourseFields } from "./form/BasicCourseFields";
import { CategoryAndLevelFields } from "./form/CategoryAndLevelFields";
import { MediaAndDurationFields } from "./form/MediaAndDurationFields";
import { CourseToggleFields } from "./form/CourseToggleFields";
import { CourseFormActions } from "./form/CourseFormActions";
import { UnauthorizedView } from "./form/UnauthorizedView";

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
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image_url: "",
      level: "",
      is_featured: false,
      is_popular: false,
    },
  });

  const onSubmit = async (values: CourseFormValues) => {
    if (!isAdmin) {
      toast.error("Only administrators can create courses");
      return;
    }
    
    // Ensure all required fields are present in courseData
    const courseData: CreateCourseData = {
      title: values.title,
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
    return <UnauthorizedView />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicCourseFields form={form} isDark={isDark} />
        <CategoryAndLevelFields form={form} isDark={isDark} />
        <MediaAndDurationFields form={form} isDark={isDark} />
        <CourseToggleFields form={form} />
        <CourseFormActions isLoading={isLoading} isAdmin={isAdmin} isDark={isDark} />
      </form>
    </Form>
  );
}
