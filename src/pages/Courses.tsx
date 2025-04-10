
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
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCourses } from "@/hooks/useCourses";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { courses, isLoading } = useCourses(category);
  
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Courses</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search courses..." 
                className="pl-9 w-full sm:w-[200px] md:w-[300px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
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
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Courses</h2>
          <CourseList courses={filteredCourses} isLoading={isLoading} />
          {filteredCourses.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={handleEnrollNow}
                className="px-6"
              >
                Enroll Now
              </Button>
            </div>
          )}
        </div>

        {/* Featured Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Courses</h2>
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
            <h2 className="text-xl font-semibold">Popular Courses</h2>
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
