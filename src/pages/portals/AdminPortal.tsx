import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  FileText, 
  BarChart3, 
  Bell, 
  UserPlus,
  GraduationCap,
  DollarSign,
  Shield
} from "lucide-react";

const AdminPortal = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const quickStats = [
    { label: "Total Students", value: "847", icon: Users, color: "text-primary" },
    { label: "Total Staff", value: "42", icon: GraduationCap, color: "text-secondary" },
    { label: "Classes", value: "24", icon: BookOpen, color: "text-accent" },
    { label: "Revenue (Monthly)", value: "₦2.4M", icon: DollarSign, color: "text-navy" },
  ];

  const recentActivities = [
    { action: "New student enrolled", details: "John Doe - JSS 1A", time: "2 hours ago" },
    { action: "Staff meeting scheduled", details: "Mathematics Department", time: "4 hours ago" },
    { action: "Fee payment received", details: "₦45,000 from Mary Johnson", time: "6 hours ago" },
    { action: "Report generated", details: "Monthly academic performance", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Admin Portal</h1>
              <p className="text-white/90">Comprehensive School Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Enroll New Student
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage student records, enrollment, and academic progress</CardDescription>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button>Search</Button>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Student management features available with backend integration.</p>
                    <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage teaching and non-teaching staff records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Staff management features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academics">
            <Card>
              <CardHeader>
                <CardTitle>Academic Management</CardTitle>
                <CardDescription>Manage curriculum, assessments, and academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Academic management features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Financial Management</CardTitle>
                <CardDescription>Manage fees, payments, and financial records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Financial management features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>System configuration features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Full Portal Functionality Available</h3>
                <p className="text-muted-foreground">
                  Connect your Lovable project to Supabase to enable complete admin portal functionality 
                  including user management, data storage, and real-time updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;