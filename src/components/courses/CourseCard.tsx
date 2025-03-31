
import { Book, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  students: number;
  lessons: number;
  progress?: number;
  category: string;
}

export function CourseCard({
  id,
  title,
  description,
  instructor,
  thumbnail,
  duration,
  students,
  lessons,
  progress,
  category,
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <Link to={`/courses/${id}`}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-elearn-secondary">{category}</Badge>
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-elearn-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{instructor}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>{lessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{students} students</span>
            </div>
          </div>
        </CardContent>
        {progress !== undefined && (
          <CardFooter className="p-4 pt-0">
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          </CardFooter>
        )}
      </Link>
    </Card>
  );
}
