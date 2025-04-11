import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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

// Sample course data for when database is empty
const sampleCourses: Omit<Course, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites from scratch.",
    category: "web-dev",
    image_url: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 120,
    level: "beginner",
    is_featured: true,
    is_popular: true,
    instructor_id: '' // Will be set dynamically
  },
  {
    title: "Advanced React Development",
    description: "Master React hooks, context API, and state management with Redux to build scalable frontend applications.",
    category: "web-dev",
    image_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 180,
    level: "advanced",
    is_featured: true,
    is_popular: false,
    instructor_id: '' // Will be set dynamically
  },
  {
    title: "Data Science Fundamentals",
    description: "Explore data analysis, visualization, and basic machine learning algorithms using Python.",
    category: "data-science",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 150,
    level: "intermediate",
    is_featured: false,
    is_popular: true,
    instructor_id: '' // Will be set dynamically
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    description: "Build intelligent systems using neural networks, deep learning, and natural language processing.",
    category: "ai",
    image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 200,
    level: "advanced",
    is_featured: true,
    is_popular: true,
    instructor_id: '' // Will be set dynamically
  },
  {
    title: "Mobile App Development with Flutter",
    description: "Create cross-platform mobile applications using Google's Flutter framework and Dart programming language.",
    category: "programming",
    image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 160,
    level: "intermediate",
    is_featured: false,
    is_popular: true,
    instructor_id: '' // Will be set dynamically
  },
  {
    title: "Full Stack JavaScript Development",
    description: "Master both frontend and backend development using JavaScript, Node.js, Express, and MongoDB.",
    category: "web-dev",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    duration: 220,
    level: "intermediate",
    is_featured: true,
    is_popular: false,
    instructor_id: '' // Will be set dynamically
  }
];

// Function to ensure sample courses exist in the database
const ensureSampleCoursesExist = async (userId: string) => {
  try {
    // First check if we have any courses
    const { data: existingCourses, error: checkError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If there are no courses, add the sample courses
    if (!existingCourses || existingCourses.length === 0) {
      console.log("No courses found, adding sample courses");
      
      // Add the sample courses with the current user as instructor
      const coursesWithInstructor = sampleCourses.map(course => ({
        ...course,
        instructor_id: userId
      }));
      
      // Insert each course one by one to avoid type issues
      for (const course of coursesWithInstructor) {
        const { error: insertError } = await supabase
          .from('courses')
          .insert(course);
        
        if (insertError) {
          console.error("Error inserting course:", insertError);
        }
      }
      
      console.log("Sample courses added successfully");
    }
  } catch (err: any) {
    console.error("Error ensuring sample courses:", err);
  }
};

export function useCourses(category: string = 'all') {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      ensureSampleCoursesExist(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchCourses = async () => {
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
      
      return formattedCourses;
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      toast({
        title: 'Error',
        description: 'Failed to load courses. Please try again.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses', category],
    queryFn: fetchCourses,
    enabled: !!session?.user,
  });

  return { courses, isLoading, error };
}

export function useFeaturedCourses() {
  const fetchFeaturedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_featured', true)
        .limit(4);
      
      if (error) throw error;
      
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
      
      return formattedCourses;
    } catch (err: any) {
      console.error('Error fetching featured courses:', err);
      return [];
    }
  };

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: fetchFeaturedCourses,
  });

  return { courses, isLoading, error };
}

export function usePopularCourses() {
  const fetchPopularCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_popular', true)
        .limit(4);
      
      if (error) throw error;
      
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
      
      return formattedCourses;
    } catch (err: any) {
      console.error('Error fetching popular courses:', err);
      return [];
    }
  };

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['popular-courses'],
    queryFn: fetchPopularCourses,
  });

  return { courses, isLoading, error };
}
