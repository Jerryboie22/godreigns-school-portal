import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Shield,
  LogOut,
  UserCog,
  Crown
} from 'lucide-react';

interface AdminDashboardProps {
  user?: any;
  profile?: {
    id: string;
    email: string;
    full_name?: string;
    role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'user';
  };
}

const AdminDashboardContent: React.FC<AdminDashboardProps> = ({ user, profile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isSuperAdmin = profile?.role === 'super_admin' || 
    ['jerryemeka22@gmail.com', 'ogrcs@yahoo.com'].includes(profile?.email || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {profile?.full_name || profile?.email}
              {isSuperAdmin && <Crown className="inline ml-2 h-5 w-5 text-yellow-500" />}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isSuperAdmin ? "default" : "secondary"}>
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">5 published this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="system">System Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => navigate('/admin/cms')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Content & Blog
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate('/admin/school-fees')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    School Fees Management
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate('/gallery')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>New user registration</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Blog post published</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Gallery updated</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isSuperAdmin ? 'Manage user roles and permissions' : 'View user information'}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management interface coming soon...</p>
                {isSuperAdmin && (
                  <div className="mt-4">
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Super Admin Privileges: Can promote/demote admins
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('/admin/cms')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Full CMS Dashboard
                </Button>
                <p className="text-sm text-muted-foreground">
                  Manage blog posts, gallery images, and homepage content.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Super Admin Controls
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Advanced system settings and user role management
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Super Admin Privileges:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Promote/demote users to admin role</li>
                      <li>• Manage global site settings</li>
                      <li>• Access system analytics</li>
                      <li>• Override all permissions</li>
                    </ul>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <UserCog className="h-3 w-3 mr-1" />
                    Super Admin Level Access
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <AuthGuard portalType="admin">
      <AdminDashboardContent />
    </AuthGuard>
  );
};

export default AdminDashboard;