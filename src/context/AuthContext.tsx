
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, employeeId?: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  avatarUrl: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check if user is admin
  const checkUserRole = async (userId: string) => {
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check for avatar URL in user metadata
        const avatar = session?.user?.user_metadata?.avatar_url;
        if (avatar) {
          setAvatarUrl(avatar);
        }

        // Check if user is admin
        if (session?.user) {
          const adminStatus = await checkUserRole(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in");
        } else if (event === 'SIGNED_OUT') {
          toast.info("You have been signed out");
          setAvatarUrl(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check for avatar URL in user metadata
      const avatar = session?.user?.user_metadata?.avatar_url;
      if (avatar) {
        setAvatarUrl(avatar);
      }
      
      // Check if user is admin
      if (session?.user) {
        const adminStatus = await checkUserRole(session.user.id);
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, employeeId?: string) => {
    try {
      // Basic credentials without custom data
      const credentials = { email, password };
      
      // Sign in with the basic credentials
      const { error } = await supabase.auth.signInWithPassword(credentials);
      
      // If login is successful and employee ID was provided, update the user metadata
      if (!error && employeeId) {
        // Get the current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          // Update the user's metadata through a separate call
          // This updates the profiles table which is created by Supabase auth
          // We don't add employee_id here as it might not be in the profiles schema
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { is_employee: true }
          });
          
          if (metadataError) {
            console.error('Error updating user metadata:', metadataError);
          } else {
            // Check if the user is now an admin
            const adminStatus = await checkUserRole(userData.user.id);
            setIsAdmin(adminStatus);
          }
        }
      }
      
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong with signing out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      avatarUrl,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
