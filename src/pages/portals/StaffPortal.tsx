import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Clock, 
  GraduationCap,
  CheckSquare,
  MessageSquare,
  Target,
  LogOut,
  Edit,
  Trash2,
  Settings,
  Bell
} from "lucide-react";
import AddScheduleModal from "@/components/modals/AddScheduleModal";
import ProfileEditModal from "@/components/modals/ProfileEditModal";
import NotificationsModal from "@/components/modals/NotificationsModal";

interface LessonSchedule {
  id: string;
  subject: string;
  class_level: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
  notes?: string;
}

const StaffPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [schedules, setSchedules] = useState<LessonSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      setProfile(profileData);
      await fetchSchedules(session.user.id);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('lesson_schedules')
        .select('*')
        .eq('staff_id', userId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Error",
        description: "Failed to load your schedules.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Schedule Deleted",
        description: "The schedule has been removed successfully.",
      });

      fetchSchedules(user.id);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Staff Portal</h1>
                <p className="text-white/90">Welcome back, {profile?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsModal userId={user?.id} />
              <Button onClick={handleLogout} variant="outline" className="text-white border-white hover:bg-white hover:text-secondary">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Classes</p>
                  <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Subjects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(schedules.map(s => s.subject)).size}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p className="text-2xl font-bold text-foreground">Active</p>
                </div>
                <Target className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>   
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Your Weekly Schedule
                    </CardTitle>
                    <CardDescription>Your teaching schedule for this week</CardDescription>
                  </div>
                  <AddScheduleModal onScheduleAdded={() => fetchSchedules(user.id)} />
                </div>
              </CardHeader>
              <CardContent>
                {schedules.length > 0 ? (
                  <div className="space-y-4">
                    {schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-2 h-12 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{schedule.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {schedule.class_level} • {schedule.room || 'TBA'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getDayName(schedule.day_of_week)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}  
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {schedule.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{schedule.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Schedule Found</p>
                    <p>Your teaching schedule will appear here once it's assigned.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-secondary" />
                  My Classes
                </CardTitle>
                <CardDescription>Classes you are teaching</CardDescription>
              </CardHeader>
              <CardContent>
                {schedules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(new Set(schedules.map(s => `${s.subject}-${s.class_level}`))).map((classKey) => {
                      const schedule = schedules.find(s => `${s.subject}-${s.class_level}` === classKey);
                      return (
                        <Card key={classKey} className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-foreground">{schedule?.subject}</h3>
                            <p className="text-sm text-muted-foreground">{schedule?.class_level}</p>
                            <div className="mt-3 space-y-2">
                              <Button variant="outline" size="sm" className="w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No classes assigned yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-accent" />
                  Teaching Resources
                </CardTitle>
                <CardDescription>Access teaching materials and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Teaching resources will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Staff Profile
                    </CardTitle>
                    <CardDescription>Your profile information</CardDescription>
                  </div>
                  <ProfileEditModal 
                    currentProfile={profile} 
                    onProfileUpdated={() => checkAuth()} 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{profile?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="font-medium capitalize">{profile?.role || 'Staff Member'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subjects Teaching</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.from(new Set(schedules.map(s => s.subject))).map(subject => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffPortal;