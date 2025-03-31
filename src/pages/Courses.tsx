
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

const Courses = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Courses</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search courses..." className="pl-9 w-full sm:w-[200px] md:w-[300px]" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Select defaultValue="all">
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
