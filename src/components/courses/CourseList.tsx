
import { CourseCard } from "./CourseCard";
import { useFeaturedCourses, usePopularCourses, Course } from "@/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CourseListProps {
  type?: 'featured' | 'popular' | 'all';
  courses?: Course[];
  isLoading?: boolean;
}

export function CourseList({ type = 'all', courses: propCourses, isLoading: propIsLoading }: CourseListProps) {
  const { courses: featuredCourses, isLoading: featuredLoading } = useFeaturedCourses();
  const { courses: popularCourses, isLoading: popularLoading } = usePopularCourses();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const queryClient = useQueryClient();
  
  let displayCourses: Course[] = [];
  let isLoading = propIsLoading;
  
  if (propCourses) {
    displayCourses = propCourses;
    isLoading = propIsLoading;
  } else {
    switch (type) {
      case 'featured':
        displayCourses = featuredCourses;
        isLoading = featuredLoading;
        break;
      case 'popular':
        displayCourses = popularCourses;
        isLoading = popularLoading;
        break;
      default:
        // For the 'all' type, we currently don't have a specific hook,
        // so we're reusing featured courses for now
        displayCourses = featuredCourses;
        isLoading = featuredLoading;
    }
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['featured-courses'] });
    queryClient.invalidateQueries({ queryKey: ['popular-courses'] });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className={`h-40 w-full rounded-md ${isDark ? 'bg-gray-700' : ''}`} />
            <Skeleton className={`h-6 w-3/4 ${isDark ? 'bg-gray-700' : ''}`} />
            <Skeleton className={`h-4 w-1/2 ${isDark ? 'bg-gray-700' : ''}`} />
            <Skeleton className={`h-4 w-full ${isDark ? 'bg-gray-700' : ''}`} />
            <div className="flex space-x-4">
              <Skeleton className={`h-4 w-14 ${isDark ? 'bg-gray-700' : ''}`} />
              <Skeleton className={`h-4 w-14 ${isDark ? 'bg-gray-700' : ''}`} />
              <Skeleton className={`h-4 w-14 ${isDark ? 'bg-gray-700' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayCourses.length === 0) {
    return (
      <div className={`p-6 rounded-lg border text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
        <p className="mb-3">No courses found.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCourses.map((course) => (
        <CourseCard 
          key={course.id} 
          id={course.id}
          title={course.title}
          description={course.description || ''}
          instructor={course.instructor_name || 'Unknown Instructor'}
          thumbnail={course.image_url || 'https://images.unsplash.com/photo-1526379879527-8559ecfcb970?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80'}
          duration={course.duration ? `${course.duration} mins` : 'Flexible'}
          students={1200} // This is hardcoded for now, could be calculated from enrollments
          lessons={24} // This is hardcoded for now, could be fetched from lessons table
          category={course.category || 'General'}
        />
      ))}
    </div>
  );
}
