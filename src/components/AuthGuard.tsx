import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, LogOut, ArrowLeft, Home, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import EmailVerification from "./EmailVerification";

interface AuthGuardProps {
  children: React.ReactNode;
  portalType: "admin" | "staff" | "parent" | "student";
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// Helper function to check if user role is authorized for portal type
const isUserAuthorized = (userRole: string, portalType: string): boolean => {
  // Admin can access all portals
  if (userRole === 'admin') return true;
  
  // Direct role match
  if (userRole === portalType) return true;
  
  // Staff and teacher are equivalent
  if ((userRole === 'staff' || userRole === 'teacher') && 
      (portalType === 'staff' || portalType === 'teacher')) return true;
  
  return false;
};

// Helper function to get dashboard URL based on user role
const getDashboardUrl = (userRole: string): string => {
  const baseUrl = 'https://www.ogrcs.com';
  
  switch (userRole) {
    case 'student':
      return `${baseUrl}/student/dashboard`;
    case 'parent':
      return `${baseUrl}/parent/dashboard`;
    case 'teacher':
    case 'staff':
      return `${baseUrl}/teacher/dashboard`;
    case 'admin':
      return `${baseUrl}/admin/dashboard`;
    default:
      return `${baseUrl}/`;
  }
};

const AuthGuard = ({ children, portalType }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);
  const [authEvent, setAuthEvent] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "", // For students
    childName: "", // For parents
  });

  useEffect(() => {
    // Set up auth state listener (sync only)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthEvent(event);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [portalType]);

  // Handle profile fetch and redirection outside of auth callback
  useEffect(() => {
    if (!session?.user) return;

    const run = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // Prefer profile role, fall back to JWT/user metadata
      const role = profileData?.role || (session.user.user_metadata as any)?.role || (session.user.app_metadata as any)?.role;

      if (profileData) {
        setProfile({
          id: profileData.user_id,
          email: profileData.email || session.user.email || '',
          full_name: profileData.full_name || '',
          role: profileData.role || ''
        });
      }

      if (authEvent === 'SIGNED_IN') {
        if (role) {
          setRedirecting(true);
          toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
          });
          const dashboardUrl = getDashboardUrl(String(role));
          // Keep spinner visible until navigation
          setTimeout(() => {
            window.location.href = dashboardUrl;
          }, 600);
          return;
        } else {
          toast({
            title: "Missing role",
            description: "No role found on your account. Please contact admin.",
            variant: "destructive",
          });
        }
      }

      if (role && isUserAuthorized(String(role), portalType)) {
        setIsAuthenticated(true);
      } else if (role) {
        setIsAuthenticated(false);
        setProfile(null);
      }

      setLoading(false);
      setRedirecting(false);
    };

    // Defer to avoid running inside the auth callback tick
    setTimeout(run, 0);
  }, [session, portalType, authEvent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
      // Success toast and redirect will be handled by onAuthStateChange
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    try {
      const redirectUrl = `https://www.ogrcs.com/portal/${portalType}`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupData.name,
            role: portalType
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setPendingVerification(signupData.email);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const handleVerificationComplete = () => {
    setPendingVerification(null);
    toast({
      title: "Email Verified",
      description: "Your account has been verified successfully.",
    });
  };

  const handleResendVerification = async () => {
    if (pendingVerification) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingVerification,
        options: {
          emailRedirectTo: `https://www.ogrcs.com/portal/${portalType}`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: "A new verification code has been sent to your email.",
        });
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            {redirecting ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <GraduationCap className="h-12 w-12 text-primary animate-pulse" />
            )}
          </div>
          <p className="text-muted-foreground">
            {redirecting ? "Redirecting to your dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (pendingVerification) {
    return (
      <EmailVerification
        email={pendingVerification}
        onVerificationComplete={handleVerificationComplete}
        onResendEmail={handleResendVerification}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="capitalize">{portalType} Portal Access</CardTitle>
            <CardDescription>
              Please login or create an account to access the {portalType} portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
                
                <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Create an account to access the portal</p>
                  <p>Or contact admin for existing account access</p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>
                  {portalType === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input
                        id="student-id"
                        type="text"
                        placeholder="Enter your student ID"
                        value={signupData.studentId}
                        onChange={(e) => setSignupData({...signupData, studentId: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  {portalType === "parent" && (
                    <div className="space-y-2">
                      <Label htmlFor="child-name">Child's Name</Label>
                      <Input
                        id="child-name"
                        type="text"
                        placeholder="Enter your child's name"
                        value={signupData.childName}
                        onChange={(e) => setSignupData({...signupData, childName: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold capitalize">{portalType} Portal</h1>
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

export default AuthGuard;