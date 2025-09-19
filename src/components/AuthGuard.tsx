import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import EmailVerification from "./EmailVerification";

interface AuthGuardProps {
  children: React.ReactNode;
  portalType: "admin" | "staff" | "parent" | "student";
}

interface User {
  id: string;
  email: string;
  name: string;
  portalType: "admin" | "staff" | "parent" | "student";
  verified: boolean;
}

const AuthGuard = ({ children, portalType }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);
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
    const checkAuth = () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.verified && parsed.portalType === portalType) {
          setUser(parsed);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [portalType]);

  const mockUsers = [
    { id: "1", email: "admin@ogrcs.edu.ng", password: "admin123", name: "Administrator", portalType: "admin" as const, verified: true },
    { id: "2", email: "teacher@ogrcs.edu.ng", password: "teacher123", name: "Adebayo Ogundimu", portalType: "staff" as const, verified: true },
    { id: "3", email: "parent@ogrcs.edu.ng", password: "parent123", name: "Mr. Olumide Adeyemi", portalType: "parent" as const, verified: true },
    { id: "4", email: "student@ogrcs.edu.ng", password: "student123", name: "Funmi Adebayo", portalType: "student" as const, verified: true },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = mockUsers.find(
      u => u.email === loginData.email && 
           u.password === loginData.password && 
           u.portalType === portalType
    );

    if (user) {
      if (!user.verified) {
        setPendingVerification(user.email);
        toast({
          title: "Email Verification Required",
          description: "Please verify your email before accessing the portal.",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem("userData", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or unauthorized access to this portal.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
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

    const existingUser = mockUsers.find(u => u.email === signupData.email);
    if (existingUser) {
      toast({
        title: "Email Already Exists",
        description: "An account with this email already exists. Please login instead.",
        variant: "destructive"
      });
      return;
    }

    setPendingVerification(signupData.email);
    toast({
      title: "Verification Email Sent",
      description: "Please check your email and enter the verification code.",
    });
  };

  const handleVerificationComplete = () => {
    const newUser: User = {
      id: Date.now().toString(),
      email: pendingVerification!,
      name: signupData.name,
      portalType,
      verified: true
    };

    localStorage.setItem("userData", JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    setPendingVerification(null);
    
    toast({
      title: "Account Created Successfully",
      description: `Welcome to ${portalType} portal, ${newUser.name}!`,
    });
  };

  const handleResendVerification = () => {
    toast({
      title: "Verification Email Sent",
      description: "A new verification code has been sent to your email.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
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
                  <p className="font-medium mb-1">Demo Credentials:</p>
                  <p>Email: {portalType}@ogrcs.edu.ng</p>
                  <p>Password: {portalType}123</p>
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
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthGuard;