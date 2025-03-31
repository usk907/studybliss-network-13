
import { CourseCard } from "./CourseCard";

// Mock data
const courses = [
  {
    id: "1",
    title: "Introduction to Python Programming",
    description: "Learn the fundamentals of Python programming language with hands-on projects.",
    instructor: "Dr. Alan Smith",
    thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcb970?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2089&q=80",
    duration: "8 weeks",
    students: 1245,
    lessons: 24,
    progress: 65,
    category: "Programming"
  },
  {
    id: "2",
    title: "Data Science and Machine Learning",
    description: "Master the essential skills for data analysis and machine learning applications.",
    instructor: "Prof. Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    duration: "10 weeks",
    students: 987,
    lessons: 32,
    progress: 25,
    category: "Data Science"
  },
  {
    id: "3",
    title: "Web Development Fundamentals",
    description: "Get started with HTML, CSS, and JavaScript to build modern web applications.",
    instructor: "Mark Williams",
    thumbnail: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    duration: "6 weeks",
    students: 1876,
    lessons: 18,
    category: "Web Development"
  },
  {
    id: "4",
    title: "Artificial Intelligence Ethics",
    description: "Explore ethical considerations in AI development and deployment.",
    instructor: "Dr. Lisa Chen",
    thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80",
    duration: "4 weeks",
    students: 542,
    lessons: 12,
    category: "AI"
  }
];

export function CourseList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
