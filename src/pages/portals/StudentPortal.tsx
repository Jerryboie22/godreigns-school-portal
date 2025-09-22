import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  FileText,
  User,
  Target,
  Award,
  GraduationCap,
  LogOut
} from "lucide-react";

interface EnrolledClass {
  id: string;
  class_name: string;
  subject: string;
  teacher_name?: string;
  grade?: string;
  attendance_percentage: number;
}

const StudentPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
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
      await fetchEnrolledClasses(session.user.id);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledClasses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrolled_classes')
        .select('*')
        .eq('student_id', userId);

      if (error) throw error;
      setEnrolledClasses(data || []);
    } catch (error) {
      console.error('Error fetching enrolled classes:', error);
      toast({
        title: "Error",
        description: "Failed to load your classes.",
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

  const calculateGPA = () => {
    if (enrolledClasses.length === 0) return 0;
    // Mock GPA calculation - in real app would be based on actual grades
    return 3.6;
  };

  const calculateOverallAttendance = () => {
    if (enrolledClasses.length === 0) return 0;
    const total = enrolledClasses.reduce((sum, cls) => sum + cls.attendance_percentage, 0);
    return Math.round(total / enrolledClasses.length);
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
      <div className="bg-gradient-to-br from-navy to-navy/80 text-navy-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Student Portal</h1>
                <p className="text-navy-foreground/90">Welcome back, {user?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-white border-white hover:bg-white hover:text-navy">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">GPA</p>
                  <p className="text-2xl font-bold text-foreground">{calculateGPA()}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{calculateOverallAttendance()}%</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Enrolled Classes</p>
                  <p className="text-2xl font-bold text-foreground">{enrolledClasses.length}</p>
                </div>
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Rank</p>
                  <p className="text-2xl font-bold text-foreground">-</p>
                </div>
                <Award className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Enrolled Classes</span>
                </CardTitle>
                <CardDescription>Your current class enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledClasses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledClasses.map((cls) => (
                      <div key={cls.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{cls.subject}</h4>
                          <div className="flex items-center space-x-2">
                            {cls.grade && (
                              <Badge variant={cls.grade.startsWith('A') ? 'default' : 'secondary'}>
                                {cls.grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Class: {cls.class_name}
                          {cls.teacher_name && ` • Teacher: ${cls.teacher_name}`}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">Attendance:</span>
                          <Progress value={cls.attendance_percentage} className="flex-1" />
                          <span className="text-sm font-medium">{cls.attendance_percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Classes Found</p>
                    <p>Your enrolled classes will appear here once you're registered for courses.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Academic Performance</span>
                </CardTitle>
                <CardDescription>Your grades and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledClasses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledClasses.map((cls) => (
                      <div key={cls.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{cls.subject}</h4>
                            <p className="text-sm text-muted-foreground">{cls.class_name}</p>
                          </div>
                          <div className="text-right">
                            {cls.grade ? (
                              <Badge variant={cls.grade.startsWith('A') ? 'default' : 'secondary'}>
                                {cls.grade}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">Grade pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No grades available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span>Class Schedule</span>
                </CardTitle>
                <CardDescription>Your class timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Schedule will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Student Profile</span>
                </CardTitle>
                <CardDescription>Your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="font-medium">Student</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Enrolled Subjects</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.from(new Set(enrolledClasses.map(cls => cls.subject))).map(subject => (
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

export default StudentPortal;