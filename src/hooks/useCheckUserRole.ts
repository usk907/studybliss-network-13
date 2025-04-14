
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if a user has admin role
 * @param userId The ID of the user to check
 * @returns Promise resolving to a boolean indicating admin status
 */
export const checkUserRole = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // First, check if the user has an employee ID associated with their account
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error('Error fetching user data:', userError);
      return false;
    }
    
    const userMetadata = userData.user.user_metadata;
    
    // Check if user has the special employee ID that grants admin access
    if (userMetadata?.is_employee && userMetadata?.employee_id === "RA2211003011971") {
      return true;
    }
    
    // As a fallback, call the is_admin database function
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
