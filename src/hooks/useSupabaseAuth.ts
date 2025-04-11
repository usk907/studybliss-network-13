
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkUserRole } from './useCheckUserRole';

export interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  avatarUrl: string | null;
  isAdmin: boolean;
}

/**
 * Hook to handle Supabase authentication state
 * @returns Authentication state and helper functions
 */
export const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return {
    user,
    session,
    loading,
    avatarUrl,
    isAdmin
  };
};
