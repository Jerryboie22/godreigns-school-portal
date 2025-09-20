import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
  portalType?: string; // Keep for backward compatibility
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'user';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/auth',
  portalType 
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check if user is authorized based on roles or super admin emails
  const checkAuthorization = (userProfile: UserProfile | null, userEmail?: string) => {
    // Fail-safe: always allow super admin emails
    if (userEmail && ['jerryemeka22@gmail.com', 'ogrcs@yahoo.com'].includes(userEmail)) {
      return true;
    }

    // Handle legacy portalType prop
    if (portalType && requiredRoles.length === 0) {
      const roleMap = {
        'admin': ['super_admin', 'admin'],
        'staff': ['teacher'],
        'student': ['student'],
        'parent': ['parent']
      };
      const mappedRoles = roleMap[portalType as keyof typeof roleMap] || [];
      return userProfile && mappedRoles.includes(userProfile.role);
    }

    // If no specific roles required, just need to be authenticated
    if (requiredRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    return userProfile && requiredRoles.includes(userProfile.role);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile fetching to avoid deadlock
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (error) {
                console.error('Error fetching profile:', error);
              }

              setProfile(profileData);
              
              const authorized = checkAuthorization(profileData, session.user.email);
              setIsAuthorized(authorized);
              
              if (!authorized && event !== 'SIGNED_OUT') {
                // Redirect based on user role or to default auth page
                if (profileData?.role === 'teacher') {
                  navigate('/portal/staff');
                } else if (profileData?.role === 'student') {
                  navigate('/portal/student');
                } else if (profileData?.role === 'parent') {
                  navigate('/portal/parent');
                } else {
                  navigate(redirectTo);
                }
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsAuthorized(false);
          setIsLoading(false);
          
          if (event !== 'SIGNED_OUT' && window.location.pathname !== '/auth') {
            navigate(redirectTo);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (error) {
              console.error('Error fetching profile:', error);
            }

            setProfile(profileData);
            
            const authorized = checkAuthorization(profileData, session.user.email);
            setIsAuthorized(authorized);
            
            if (!authorized) {
              if (profileData?.role === 'teacher') {
                navigate('/portal/staff');
              } else if (profileData?.role === 'student') {
                navigate('/portal/student');
              } else if (profileData?.role === 'parent') {
                navigate('/portal/parent');
              } else {
                navigate(redirectTo);
              }
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
        navigate(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, requiredRoles, portalType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null; // Will redirect via useEffect
  }

  // Pass user and profile data to children
  return React.cloneElement(children as React.ReactElement, { 
    user, 
    profile, 
    session 
  });
};

export default AuthGuard;