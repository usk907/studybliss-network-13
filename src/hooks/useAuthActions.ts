
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkUserRole } from './useCheckUserRole';

export interface AuthError {
  error: any | null;
}

/**
 * Hook providing authentication actions (sign in, sign up, sign out)
 * @returns Object containing authentication action functions
 */
export const useAuthActions = () => {
  const signIn = async (email: string, password: string, employeeId?: string): Promise<AuthError> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      // If login is successful and employee ID was provided, update the user metadata
      if (!error && employeeId) {
        // Get the current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // Update the user's metadata through a separate call
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { is_employee: true }
          });
          
          if (metadataError) {
            console.error('Error updating user metadata:', metadataError);
          }
        }
      }
      
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthError> => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (!error) {
        toast.success("Account created. Please check your email to confirm your account");
      }
      
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong with signing out");
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
