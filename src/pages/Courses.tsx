import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CourseList } from "@/components/courses/CourseList";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search, SlidersHorizontal, RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";
import { useTheme } from "@/context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { courses, isLoading, error } = useCourses(category);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const queryClient = useQueryClient();
  
  // Filter courses by search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search applied",
        description: `Showing results for "${searchQuery}"`,
      });
    }
  };
  
  const handleFilter = () => {
    toast({
      title: "Advanced Filters",
      description: "Showing advanced filter options",
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    toast({
      title: "Category filter applied",
      description: `Showing ${value === "all" ? "all categories" : value} courses`,
    });
  };

  const handleEnrollNow = () => {
    toast({
      title: "Enrollment",
      description: "Opening enrollment process",
    });
  };

  const handleRefreshCourses = () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['featured-courses'] });
    queryClient.invalidateQueries({ queryKey: ['popular-courses'] });
    toast({
      title: "Refreshing courses",
      description: "Loading latest course data",
    });
  };
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : ''}`}>Courses</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefreshCourses}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search courses..." 
                className={`pl-9 w-full sm:w-[200px] md:w-[300px] ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : ''}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 ${isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-700' : ''}`}
              onClick={handleFilter}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Select 
              defaultValue="all" 
              value={category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className={`w-[120px] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white'}>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="flex items-center gap-2"
              onClick={() => navigate("/courses/create")}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Course</span>
            </Button>
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>All Courses</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className={`h-40 w-full rounded-md ${isDark ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-6 w-3/4 ${isDark ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-4 w-1/2 ${isDark ? 'bg-gray-700' : ''}`} />
                  <Skeleton className={`h-4 w-full ${isDark ? 'bg-gray-700' : ''}`} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={`p-8 text-center rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50'}`}>
              <p className="mb-2 text-lg font-semibold">Failed to load courses</p>
              <p className="mb-4 text-sm text-gray-500">There was an error loading the courses. Please try again.</p>
              <Button onClick={handleRefreshCourses}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className={`p-8 text-center rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-gray-50'}`}>
              <p className="mb-2 text-lg font-semibold">No courses found</p>
              {searchQuery ? (
                <p className="mb-4 text-sm text-gray-500">No courses match your search criteria. Try a different search term.</p>
              ) : (
                <p className="mb-4 text-sm text-gray-500">There are no courses available in this category yet.</p>
              )}
              <Button onClick={() => {
                setSearchQuery('');
                setCategory('all');
              }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <CourseList courses={filteredCourses} isLoading={isLoading} />
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleEnrollNow}
                  className="px-6"
                >
                  Enroll Now
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Featured Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>Featured Courses</h2>
            <Button 
              variant="link" 
              className="text-elearn-primary"
              onClick={() => toast({
                title: "Featured Courses",
                description: "Viewing all featured courses",
              })}
            >
              View all
            </Button>
          </div>
          <CourseList type="featured" />
        </div>

        {/* Popular Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>Popular Courses</h2>
            <Button 
              variant="link" 
              className="text-elearn-primary"
              onClick={() => toast({
                title: "Popular Courses",
                description: "Viewing all popular courses",
              })}
            >
              View all
            </Button>
          </div>
          <CourseList type="popular" />
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;
