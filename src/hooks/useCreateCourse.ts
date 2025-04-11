
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  image_url?: string;
  duration?: number;
  level: string;
  is_featured?: boolean;
  is_popular?: boolean;
}

export function useCreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createCourse = async (courseData: CreateCourseData) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a course",
          variant: "destructive"
        });
        return false;
      }
      
      // Insert the course with the current user as instructor
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          instructor_id: session.user.id
        })
        .select();
      
      if (error) throw error;
      
      // Invalidate relevant queries to refresh course lists
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['featured-courses'] });
      queryClient.invalidateQueries({ queryKey: ['popular-courses'] });
      
      toast({
        title: "Course Created",
        description: "Your course has been successfully added",
      });
      
      if (data && data[0]) {
        return data[0];
      }
      
      return true;
    } catch (err: any) {
      console.error("Error creating course:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create course. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCourse, isLoading };
}
