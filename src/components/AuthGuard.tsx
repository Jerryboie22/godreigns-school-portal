import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  portalType: "staff" | "admin" | "parent" | "student";
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const AuthGuard = ({ children, portalType }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    employeeId: "",
    subject: ""
  });
  const { toast } = useToast();

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem(`${portalType}_user`);
      if (user) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [portalType]);

  // Mock users database
  const mockUsers = {
    staff: [
      { id: "1", email: "teacher@school.com", password: "teacher123", name: "Mrs. Adunni Oladele", role: "Mathematics Teacher" },
      { id: "2", email: "physics@school.com", password: "physics123", name: "Mr. Chike Nwosu", role: "Physics Teacher" },
    ],
    admin: [
      { id: "1", email: "admin@school.com", password: "admin123", name: "Mr. Tunde Balogun", role: "School Administrator" },
    ],
    parent: [
      { id: "1", email: "parent@email.com", password: "parent123", name: "Mrs. Folake Adebayo", role: "Parent" },
    ],
    student: [
      { id: "1", email: "student@school.com", password: "student123", name: "Adebayo Oladimeji", role: "Student - JSS 2A" },
    ]
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    // Check credentials against mock database
    const users = mockUsers[portalType];
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      const userData = { id: user.id, email: user.email, name: user.name, role: user.role };
      localStorage.setItem(`${portalType}_user`, JSON.stringify(userData));
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    // Check if user already exists
    const users = mockUsers[portalType];
    const existingUser = users.find(u => u.email === signupData.email);

    if (existingUser) {
      toast({
        title: "Account Exists",
        description: "An account with this email already exists. Please login instead.",
        variant: "destructive"
      });
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: signupData.email,
      name: signupData.name,
      role: `${portalType.charAt(0).toUpperCase() + portalType.slice(1)} - ${signupData.subject || 'General'}`
    };

    localStorage.setItem(`${portalType}_user`, JSON.stringify(newUser));
    setIsAuthenticated(true);
    
    toast({
      title: "Account Created",
      description: `Welcome to the ${portalType} portal, ${signupData.name}!`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(`${portalType}_user`);
    setIsAuthenticated(false);
    setLoginData({ email: "", password: "" });
    setSignupData({ name: "", email: "", password: "", confirmPassword: "", employeeId: "", subject: "" });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {portalType.charAt(0).toUpperCase() + portalType.slice(1)} Portal
            </CardTitle>
            <CardDescription>
              Access your {portalType} dashboard and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Demo Credentials:</p>
                  <p className="text-sm text-muted-foreground">
                    Email: {portalType}@school.com<br />
                    Password: {portalType}123
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {portalType === "staff" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={signupData.employeeId}
                          onChange={(e) => setSignupData(prev => ({ ...prev, employeeId: e.target.value }))}
                          placeholder="Enter your employee ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject/Department</Label>
                        <Input
                          id="subject"
                          value={signupData.subject}
                          onChange={(e) => setSignupData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="e.g., Mathematics, English"
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated, render children with logout option
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
};