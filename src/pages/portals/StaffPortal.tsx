import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Clock, 
  GraduationCap,
  CheckSquare,
  MessageSquare,
  Target
} from "lucide-react";

const StaffPortal = () => {
  const todaysSchedule = [
    { time: "8:00 AM", subject: "Mathematics", class: "JSS 2A", room: "Room 12" },
    { time: "10:00 AM", subject: "English Language", class: "SSS 1B", room: "Room 8" },
    { time: "12:00 PM", subject: "Physics", class: "SSS 3A", room: "Lab 2" },
    { time: "2:00 PM", subject: "Free Period", class: "-", room: "-" },
  ];

  const assignments = [
    { subject: "Mathematics", class: "JSS 2", title: "Algebraic Expressions", dueDate: "2024-09-20", status: "Pending" },
    { subject: "English", class: "SSS 1", title: "Essay Writing", dueDate: "2024-09-18", status: "Graded" },
    { subject: "Physics", class: "SSS 3", title: "Wave Motion", dueDate: "2024-09-22", status: "Not Started" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-secondary to-secondary/80 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Staff Portal</h1>
              <p className="text-white/90">Teacher Resources and Student Management</p>
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
                  <p className="text-muted-foreground text-sm">My Classes</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">245</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Assignments</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Messages</p>
                  <p className="text-2xl font-bold text-foreground">4</p>
                </div>
                <MessageSquare className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    <span>Today's Schedule</span>
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaysSchedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="text-sm font-medium text-secondary w-20">{item.time}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.class} {item.room !== "-" && `• ${item.room}`}
                        </p>
                      </div>
                      <Badge variant={item.subject === "Free Period" ? "secondary" : "outline"}>
                        {item.subject === "Free Period" ? "Break" : "Class"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-secondary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Grade Assignments
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Take Attendance
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Records</CardTitle>
                <CardDescription>Manage your students' information and academic progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Student management features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>Create, distribute, and grade assignments</CardDescription>
                <Button className="w-fit">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Assignment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject} • {assignment.class} • Due: {assignment.dueDate}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          assignment.status === "Graded" ? "default" : 
                          assignment.status === "Pending" ? "secondary" : "outline"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Resources</CardTitle>
                <CardDescription>Access lesson plans, materials, and educational resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Resource management features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Student Reports</CardTitle>
                <CardDescription>Generate and manage student progress reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Report generation features available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable full functionality.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-secondary/20 bg-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6 text-secondary" />
              <div>
                <h3 className="font-semibold text-secondary">Enhanced Teaching Experience</h3>
                <p className="text-muted-foreground">
                  Connect to Supabase to unlock full staff portal features including student records, 
                  assignment management, grade tracking, and parent communication tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffPortal;