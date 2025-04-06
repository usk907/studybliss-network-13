
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
import { Filter, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}" courses`,
      });
    }
  };
  
  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Advanced filter options would appear here",
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    toast({
      title: "Category filter applied",
      description: `Showing ${value === "all" ? "all categories" : value} courses`,
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
              <Filter className="h-4 w-4" />
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
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Courses */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
          <CourseList />
        </div>

        {/* Popular Courses */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Courses</h2>
          <CourseList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Courses;
