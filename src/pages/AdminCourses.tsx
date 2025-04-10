
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, PlusCircle, Trash, Edit, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  duration: number | null;
  level: string | null;
  is_featured: boolean | null;
  is_popular: boolean | null;
  instructor_id: string;
  instructor_name?: string;
}

const AdminCourses = () => {
  const { user, isAdmin, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "programming",
    image_url: "https://images.unsplash.com/photo-1526379879527-8559ecfcb970?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80",
    duration: 60,
    level: "beginner",
    is_featured: false,
    is_popular: false
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch courses from the database
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey (full_name)
        `);
      
      if (error) throw error;
      
      // Transform data to match the expected format
      const formattedCourses = data.map((course: any) => ({
        ...course,
        instructor_name: course.profiles?.full_name || 'Unknown Instructor'
      }));
      
      setCourses(formattedCourses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchCourses();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewCourse({
      ...newCourse,
      [name]: value
    });
  };

  const handleCheckboxChange = (name: string) => {
    setNewCourse({
      ...newCourse,
      [name]: !newCourse[name as keyof typeof newCourse]
    });
  };

  const handleAddCourse = async () => {
    try {
      if (!newCourse.title.trim()) {
        toast.error("Course title is required");
        return;
      }

      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          category: newCourse.category,
          image_url: newCourse.image_url,
          duration: Number(newCourse.duration),
          level: newCourse.level,
          is_featured: newCourse.is_featured,
          is_popular: newCourse.is_popular,
          instructor_id: user?.id
        })
        .select();

      if (error) throw error;

      toast.success("Course added successfully");
      setNewCourse({
        title: "",
        description: "",
        category: "programming",
        image_url: "https://images.unsplash.com/photo-1526379879527-8559ecfcb970?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80",
        duration: 60,
        level: "beginner",
        is_featured: false,
        is_popular: false
      });
      setDialogOpen(false);
      fetchCourses();
    } catch (error: any) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course: " + error.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast.success("Course deleted successfully");
      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course: " + error.message);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin - Course Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Add New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Create a new course by filling out the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newCourse.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newCourse.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="category">Category</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={newCourse.image_url}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={newCourse.duration}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="level">Level</Label>
                  <Select
                    value={newCourse.level}
                    onValueChange={(value) => handleSelectChange("level", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Featured</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCourse.is_featured}
                      onChange={() => handleCheckboxChange("is_featured")}
                      className="mr-2"
                    />
                    <span>Mark as featured course</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Popular</Label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCourse.is_popular}
                      onChange={() => handleCheckboxChange("is_popular")}
                      className="mr-2"
                    />
                    <span>Mark as popular course</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddCourse}>
                  Add Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course List</CardTitle>
            <CardDescription>
              Manage all courses. You can add, edit, or delete courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No courses found. Add your first course!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category || 'N/A'}</TableCell>
                      <TableCell>{course.level || 'N/A'}</TableCell>
                      <TableCell>{course.duration ? `${course.duration} mins` : 'N/A'}</TableCell>
                      <TableCell>{course.is_featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{course.is_popular ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="mr-2">
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the course "{course.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

// Label component for our form
const Label = ({ className, children, htmlFor }: { className?: string; children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}>
    {children}
  </label>
);

export default AdminCourses;
