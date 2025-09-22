import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Download,
  Edit
} from "lucide-react";

interface PortalSection {
  id: string;
  section_key: string;
  title: string;
  description: string | null;
  icon: string;
  order_index: number;
  is_visible: boolean;
  content_type: string;
}

const iconMap = {
  Trophy, Clock, FileText, BookOpen, Target
};

const StudentPortalContent = () => {
  const [portalSections, setPortalSections] = useState<PortalSection[]>([]);
  const [studentInfo, setStudentInfo] = useState({
    name: "Adebayo Olamide",
    class: "SSS 2B",
    admissionNumber: "OGR/2022/0567",
    currentTerm: "First Term 2024/2025"
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", class: "" });

  useEffect(() => {
    fetchPortalSections();
  }, []);

  const fetchPortalSections = async () => {
    try {
      const { data, error } = await supabase
        .from('portal_sections')
        .select('*')
        .eq('portal_type', 'student')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPortalSections(data || []);
    } catch (error) {
      console.error('Error fetching portal sections:', error);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2 text-primary" /> : <FileText className="h-5 w-5 mr-2 text-primary" />;
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
    { time: "8:00 - 9:00", subject: "Mathematics", teacher: "Mr. Chukwuma Adebisi", room: "Room 15" },
    { time: "9:00 - 10:00", subject: "English Language", teacher: "Mrs. Folake Okafor", room: "Room 8" },
    { time: "10:00 - 10:30", subject: "Break", teacher: "-", room: "-" },
    { time: "10:30 - 11:30", subject: "Physics", teacher: "Dr. Kwame Mensah", room: "Lab 2" },
    { time: "11:30 - 12:30", subject: "Chemistry", teacher: "Mrs. Aisha Balogun", room: "Lab 1" },
  ];

  const handleEditProfile = () => {
    setEditingProfile(true);
    setProfileForm({ name: studentInfo.name, class: studentInfo.class });
  };

  const handleSaveProfile = () => {
    setStudentInfo(prev => ({ ...prev, ...profileForm }));
    setEditingProfile(false);
  };

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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-navy" />
                <span>Student Profile</span>
              </div>
              <Button variant="outline" size="sm" onClick={editingProfile ? handleSaveProfile : handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                {editingProfile ? 'Save' : 'Edit'}
              </Button>
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
                  {editingProfile ? (
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Student Name"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{studentInfo.name}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  {editingProfile ? (
                    <Input
                      value={profileForm.class}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, class: e.target.value }))}
                      placeholder="Class"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{studentInfo.class}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Term</p>
                  <p className="font-medium text-foreground">{studentInfo.currentTerm}</p>
                </div>
              </div>
              {editingProfile && (
                <Button variant="outline" onClick={() => setEditingProfile(false)}>
                  Cancel
                </Button>
              )}
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

        {portalSections.length > 0 && (
          <Tabs defaultValue={portalSections[0]?.section_key || "grades"} className="space-y-6">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(portalSections.length, 5)}, minmax(0, 1fr))` }}>
              {portalSections.map((section) => (
                <TabsTrigger key={section.section_key} value={section.section_key}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {portalSections.map((section) => (
              <TabsContent key={section.section_key} value={section.section_key}>
                {section.content_type === 'grades' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
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
                )}

                {section.content_type === 'assignments' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
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
                )}

                {section.content_type === 'schedule' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
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
                )}

                {section.content_type === 'resources' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
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
                          <p>Additional learning resources will be available soon.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {section.content_type === 'progress' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
                        <span>Academic Progress</span>
                      </CardTitle>
                      <CardDescription>Track your improvement over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Progress tracking will be available soon.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {section.content_type === 'custom' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {renderIcon(section.icon)}
                        <span>{section.title}</span>
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Custom content for {section.title} will be available soon.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {portalSections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Loading portal sections...</p>
          </div>
        )}

      </div>
    </div>
  );
};

const StudentPortal = () => {
  return (
    <AuthGuard portalType="student">
      <StudentPortalContent />
    </AuthGuard>
  );
};

export default StudentPortal;