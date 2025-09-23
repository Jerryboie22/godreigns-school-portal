import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, ArrowLeft, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

interface UserProfile {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
}

const SimpleAuthGuard = ({ children, allowedRoles }: SimpleAuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async (uid: string) => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle();

        if (cancelled) return;

        if (profileData) {
          setProfile(profileData);
          // Check if user's role is in allowedRoles
          const userRole = profileData.role;
          const authorized = allowedRoles.includes(userRole) || allowedRoles.includes('admin') && userRole === 'admin';
          setIsAuthorized(authorized);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsAuthorized(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsAuthorized(false);
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [allowedRoles]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not authorized - redirect to appropriate role
  if (!isAuthorized && profile) {
    const roleRoutes: Record<string, string> = {
      admin: '/admin',
      staff: '/staff', 
      teacher: '/staff',
      parent: '/parent',
      student: '/student'
    };
    
    const redirectPath = roleRoutes[profile.role];
    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
    
    // If role not recognized, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authorized - render children with header
  return (
    <div className="min-h-screen">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold capitalize">{profile?.role} Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SimpleAuthGuard;