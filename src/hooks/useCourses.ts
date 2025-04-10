
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string | null;
  image_url: string | null;
  duration: number | null;
  level: string | null;
  is_featured: boolean | null;
  is_popular: boolean | null;
  created_at: string;
  updated_at: string;
  instructor_name?: string;
}

export function useCourses(category: string = 'all') {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase.from('courses').select('*');
        
        if (category !== 'all') {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Since we don't have a direct relationship between courses and profiles,
        // fetch instructor names separately if needed
        const formattedCourses = await Promise.all(
          data.map(async (course) => {
            let instructorName = 'Unknown Instructor';
            
            if (course.instructor_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', course.instructor_id)
                .single();
                
              if (profileData && profileData.full_name) {
                instructorName = profileData.full_name;
              }
            }
            
            return {
              ...course,
              instructor_name: instructorName
            };
          })
        );
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to fetch courses');
        toast({
          title: 'Error',
          description: 'Failed to load courses. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [category]);
  
  return { courses, isLoading, error };
}

export function useFeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_featured', true)
          .limit(4);
        
        if (error) throw error;
        
        // Since we don't have a direct relationship between courses and profiles,
        // fetch instructor names separately if needed
        const formattedCourses = await Promise.all(
          data.map(async (course) => {
            let instructorName = 'Unknown Instructor';
            
            if (course.instructor_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', course.instructor_id)
                .single();
                
              if (profileData && profileData.full_name) {
                instructorName = profileData.full_name;
              }
            }
            
            return {
              ...course,
              instructor_name: instructorName
            };
          })
        );
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('Error fetching featured courses:', err);
        setError(err.message || 'Failed to fetch featured courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedCourses();
  }, []);
  
  return { courses, isLoading, error };
}

export function usePopularCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_popular', true)
          .limit(4);
        
        if (error) throw error;
        
        // Since we don't have a direct relationship between courses and profiles,
        // fetch instructor names separately if needed
        const formattedCourses = await Promise.all(
          data.map(async (course) => {
            let instructorName = 'Unknown Instructor';
            
            if (course.instructor_id) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', course.instructor_id)
                .single();
                
              if (profileData && profileData.full_name) {
                instructorName = profileData.full_name;
              }
            }
            
            return {
              ...course,
              instructor_name: instructorName
            };
          })
        );
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('Error fetching popular courses:', err);
        setError(err.message || 'Failed to fetch popular courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopularCourses();
  }, []);
  
  return { courses, isLoading, error };
}
