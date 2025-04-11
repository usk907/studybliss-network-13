
import { AppLayout } from "@/components/layout/AppLayout";
import { CreateCourseForm } from "@/components/courses/CreateCourseForm";
import { useTheme } from "@/context/ThemeContext";

const CreateCourse = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : ''}`}>
            Create New Course
          </h1>
          <p className={`mt-2 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Fill in the details below to add a new course to the platform.
          </p>
        </div>
        
        <div className={`p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'}`}>
          <CreateCourseForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateCourse;
