import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface Student {
  id: string;
  student_id: string;
  class: string;
  profiles: { full_name: string; email: string };
  created_at: string;
}

interface Teacher {
  id: string;
  employee_id: string;
  name: string;
  subject: string;
  department: string;
  profiles: { full_name: string; email: string };
}

const AdminPortalContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Real data states
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    totalRevenue: 0,
    pendingFees: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  // Form states
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({ name: "", class: "", student_id: "" });
  const [staffForm, setStaffForm] = useState({ name: "", subject: "", department: "", employee_id: "" });
  const [newAdminForm, setNewAdminForm] = useState({ 
    email: "", 
    full_name: "", 
    role: "admin" as "admin" | "teacher" | "parent" | "student" | "user" | "super_admin"
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
    fetchAllData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setCurrentUser(profile);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch students with profiles
      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      // Fetch teachers with profiles  
      const { data: teachersData } = await supabase
        .from('teachers')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      // Fetch all profiles for user management
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch analytics data
      const { data: feesData } = await supabase
        .from('school_fees')
        .select('amount, status');

      // Calculate analytics
      const totalStudents = studentsData?.length || 0;
      const totalStaff = teachersData?.length || 0;
      const totalClasses = new Set(studentsData?.map(s => s.class)).size || 0;
      
      const paidFees = feesData?.filter(f => f.status === 'paid').reduce((sum, f) => sum + Number(f.amount), 0) || 0;
      const pendingFees = feesData?.filter(f => f.status === 'pending').reduce((sum, f) => sum + Number(f.amount), 0) || 0;

      setStudents(studentsData || []);
      setTeachers(teachersData || []);
      setAllProfiles(profilesData || []);
      setAnalytics({
        totalStudents,
        totalStaff,
        totalClasses,
        totalRevenue: paidFees,
        pendingFees
      });

      // Generate recent activities from real data
      const activities = [];
      if (studentsData?.length > 0) {
        activities.push({
          action: "New student enrolled",
          details: `${studentsData[0].profiles?.full_name} - ${studentsData[0].class}`,
          time: new Date(studentsData[0].created_at).toLocaleDateString()
        });
      }
      if (teachersData?.length > 0) {
        activities.push({
          action: "New staff added",
          details: `${teachersData[0].profiles?.full_name} - ${teachersData[0].department}`,
          time: new Date(teachersData[0].created_at).toLocaleDateString()
        });
      }
      if (feesData?.some(f => f.status === 'paid')) {
        activities.push({
          action: "Fee payment received",
          details: `₦${feesData.find(f => f.status === 'paid')?.amount.toLocaleString()}`,
          time: "Today"
        });
      }
      
      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!currentUser || currentUser.role !== 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Only super admins can add other admins.",
        variant: "destructive"
      });
      return;
    }

    if (!newAdminForm.email || !newAdminForm.full_name) {
      toast({
        title: "Missing Information",
        description: "Please provide email and full name.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', newAdminForm.email)
        .single();

      if (existingProfile) {
        // Update existing user's role
        const { error } = await supabase
          .from('profiles')
          .update({ role: newAdminForm.role })
          .eq('email', newAdminForm.email);

        if (error) throw error;

        toast({
          title: "Admin Added",
          description: `${newAdminForm.full_name} has been granted admin access.`
        });
      } else {
        toast({
          title: "User Not Found",
          description: "User must create an account first before being granted admin access.",
          variant: "destructive"
        });
      }

      setNewAdminForm({ email: "", full_name: "", role: "admin" as "admin" });
      fetchAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add admin.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (!currentUser || currentUser.role !== 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Only super admins can modify user roles.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User role has been updated successfully."
      });
      
      fetchAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser || currentUser.role !== 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Only super admins can delete users.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Note: This will cascade delete due to foreign key constraints
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      toast({
        title: "User Deleted",
        description: "User has been removed from the system."
      });
      
      fetchAllData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const quickStats = [
    { label: "Total Students", value: analytics.totalStudents.toString(), icon: Users, color: "text-primary" },
    { label: "Total Staff", value: analytics.totalStaff.toString(), icon: GraduationCap, color: "text-secondary" },
    { label: "Classes", value: analytics.totalClasses.toString(), icon: BookOpen, color: "text-accent" },
    { label: "Revenue (Total)", value: `₦${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-navy" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Admin Portal</h1>
              <p className="text-white/90">Comprehensive School Management System</p>
              {currentUser && (
                <p className="text-white/70 text-sm">
                  Role: {currentUser.role} | {currentUser.full_name}
                </p>
              )}
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
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
                  {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted-foreground text-center py-4">No recent activities</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/admin-cms">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Manage Content (CMS)
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Blog Posts
                    </Button>
                  </Link>
                  <Link to="/admin/cms">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Gallery
                    </Button>
                  </Link>
                  <Link to="/portals">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      All Portals
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management ({analytics.totalStudents})</CardTitle>
                <CardDescription>Manage student records and information</CardDescription>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <p className="text-center py-4">Loading students...</p>
                ) : (
                  <div className="space-y-4">
                    {students.filter(student => 
                      student.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{student.profiles?.full_name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">
                            Class: {student.class || 'Not assigned'} | Student ID: {student.student_id || 'Not set'}
                          </p>
                          <p className="text-xs text-muted-foreground">Email: {student.profiles?.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {students.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No students found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management ({analytics.totalStaff})</CardTitle>
                <CardDescription>Manage teaching and non-teaching staff</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <p className="text-center py-4">Loading staff...</p>
                ) : (
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{teacher.profiles?.full_name || teacher.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Subject: {teacher.subject || 'Not assigned'} | Department: {teacher.department || 'Not set'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Employee ID: {teacher.employee_id} | Email: {teacher.profiles?.email}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {teachers.length === 0 && (
                      <p className="text-center py-8 text-muted-foreground">No staff found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              {/* Add Admin Section (Only for Super Admins) */}
              {currentUser?.role === 'super_admin' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      <span>Add Admin User</span>
                    </CardTitle>
                    <CardDescription>Grant admin access to existing users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Email"
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({...newAdminForm, email: e.target.value})}
                      />
                      <Input
                        placeholder="Full Name"
                        value={newAdminForm.full_name}
                        onChange={(e) => setNewAdminForm({...newAdminForm, full_name: e.target.value})}
                      />
                          <Select value={newAdminForm.role} onValueChange={(value: any) => setNewAdminForm({...newAdminForm, role: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                      <Button onClick={handleAddAdmin}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle>User Management ({allProfiles.length})</CardTitle>
                  <CardDescription>Manage all system users and their roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allProfiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{profile.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Email: {profile.email}
                          </p>
                          <Badge variant={profile.role === 'super_admin' ? 'default' : profile.role === 'admin' ? 'secondary' : 'outline'}>
                            {profile.role}
                          </Badge>
                        </div>
                        {currentUser?.role === 'super_admin' && profile.id !== currentUser.id && (
                          <div className="flex space-x-2">
                            <Select value={profile.role} onValueChange={(value) => handleUpdateUserRole(profile.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(profile.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics">
            <Card>
              <CardHeader>
                <CardTitle>Academic Management</CardTitle>
                <CardDescription>Manage courses, classes, and academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Academic management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>School fees and financial management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">₦{analytics.totalRevenue.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Pending Fees</p>
                          <p className="text-2xl font-bold text-orange-600">₦{analytics.pendingFees.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Link to="/admin/school-fees">
                  <Button className="w-full">Manage School Fees</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure school management system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">System settings coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminPortal = () => {
  return (
    <AuthGuard portalType="admin">
      <AdminPortalContent />
    </AuthGuard>
  );
};

export default AdminPortal;