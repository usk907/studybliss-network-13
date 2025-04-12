
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if a user has admin role
 * @param userId The ID of the user to check
 * @returns Promise resolving to a boolean indicating admin status
 */
export const checkUserRole = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Call the is_admin database function to check admin status
    const { data, error } = await (supabase.rpc as any)('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    // If the function returns null or undefined, the user is not an admin
    return !!data;
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return false;
  }
};
