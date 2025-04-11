
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if a user has admin role
 * @param userId The ID of the user to check
 * @returns Promise resolving to a boolean indicating admin status
 */
export const checkUserRole = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Cast both the function name and params to any to bypass type checking
    const { data, error } = await (supabase.rpc as any)('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in checkUserRole:', error);
    return false;
  }
};
