import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Download
} from "lucide-react";

const StudentPortal = () => {
  const studentInfo = {
    name: "John Adebayo",
    class: "SSS 2B",
    admissionNumber: "OGR/2022/0567",
    currentTerm: "First Term 2024/2025"
  };

  const currentGrades = [
    { subject: "Mathematics", currentGrade: "B+", percentage: 85, target: "A" },
    { subject: "English Language", currentGrade: "A", percentage: 92, target: "A" },
    { subject: "Physics", currentGrade: "B", percentage: 78, target: "B+" },
    { subject: "Chemistry", currentGrade: "B+", percentage: 88, target: "A" },
    { subject: "Biology", currentGrade: "A", percentage: 95, target: "A" },
    { subject: "Geography", currentGrade: "B", percentage: 82, target: "B+" },
  ];

  const assignments = [
    { subject: "Mathematics", title: "Quadratic Equations", dueDate: "2024-09-22", status: "Submitted", score: "85%" },
    { subject: "Physics", title: "Simple Harmonic Motion", dueDate: "2024-09-25", status: "Pending", score: "-" },
    { subject: "English", title: "Literature Essay", dueDate: "2024-09-20", status: "Graded", score: "92%" },
    { subject: "Chemistry", title: "Organic Compounds", dueDate: "2024-09-28", status: "Not Started", score: "-" },
  ];

  const schedule = [
    { time: "8:00 - 9:00", subject: "Mathematics", teacher: "Mr. Adebisi", room: "Room 15" },
    { time: "9:00 - 10:00", subject: "English Language", teacher: "Mrs. Okafor", room: "Room 8" },
    { time: "10:00 - 10:30", subject: "Break", teacher: "-", room: "-" },
    { time: "10:30 - 11:30", subject: "Physics", teacher: "Dr. Mensah", room: "Lab 2" },
    { time: "11:30 - 12:30", subject: "Chemistry", teacher: "Mrs. Balogun", room: "Lab 1" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-navy to-navy/80 text-navy-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Student Portal</h1>
              <p className="text-navy-foreground/90">Your Academic Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Student Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <User className="h-6 w-6 text-navy" />
              <span>Student Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium text-foreground">{studentInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium text-foreground">{studentInfo.class}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Term</p>
                  <p className="font-medium text-foreground">{studentInfo.currentTerm}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">GPA</p>
                  <p className="text-2xl font-bold text-foreground">3.6</p>
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
                  <p className="text-2xl font-bold text-foreground">98%</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Assignments</p>
                  <p className="text-2xl font-bold text-foreground">15</p>
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
                  <p className="text-2xl font-bold text-foreground">8/45</p>
                </div>
                <Award className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Current Term Grades</span>
                </CardTitle>
                <CardDescription>Your academic performance this term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentGrades.map((grade, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{grade.subject}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={grade.currentGrade.startsWith('A') ? 'default' : 'secondary'}>
                            {grade.currentGrade}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Target: {grade.target}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={grade.percentage} className="flex-1" />
                        <span className="text-sm font-medium">{grade.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <span>Assignments & Tasks</span>
                </CardTitle>
                <CardDescription>Your current and upcoming assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject} • Due: {assignment.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {assignment.score !== "-" && (
                          <span className="font-medium">{assignment.score}</span>
                        )}
                        <Badge 
                          variant={
                            assignment.status === "Graded" ? "default" : 
                            assignment.status === "Submitted" ? "secondary" : "outline"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
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
              <CardContent>
                <div className="space-y-4">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="text-sm font-medium text-secondary w-24">{item.time}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.subject}</p>
                        {item.teacher !== "-" && (
                          <p className="text-sm text-muted-foreground">
                            {item.teacher} • {item.room}
                          </p>
                        )}
                      </div>
                      <Badge variant={item.subject === "Break" ? "secondary" : "outline"}>
                        {item.subject === "Break" ? "Break" : "Class"}
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
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Learning Resources</span>
                </CardTitle>
                <CardDescription>Study materials and educational resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-foreground mb-2">Mathematics Notes</h4>
                      <p className="text-sm text-muted-foreground mb-3">Quadratic Equations and Graphs</p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-foreground mb-2">Physics Lab Manual</h4>
                      <p className="text-sm text-muted-foreground mb-3">Wave Motion Experiments</p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>More learning resources available with backend integration.</p>
                    <p className="text-sm mt-2">Connect to Supabase to access full digital library.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Academic Progress</span>
                </CardTitle>
                <CardDescription>Track your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed progress tracking available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to view comprehensive academic analytics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-navy/20 bg-navy/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6 text-navy" />
              <div>
                <h3 className="font-semibold text-navy">Enhanced Learning Experience</h3>
                <p className="text-muted-foreground">
                  Connect to Supabase to unlock full student portal features including real-time grades, 
                  assignment submissions, resource downloads, and progress tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPortal;