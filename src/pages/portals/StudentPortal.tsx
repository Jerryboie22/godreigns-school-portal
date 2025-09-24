import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Edit,
  Save,
  X
} from "lucide-react";

const StudentPortalContent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    name: "Adebayo Olamide",
    class: "SSS 2B",
    admissionNumber: "OGR/2022/0567",
    currentTerm: "First Term 2024/2025",
    email: "",
    address: "",
    parentContact: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    medicalConditions: "",
    previousSchool: ""
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: "", 
    class: "", 
    email: "",
    address: "",
    parentContact: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    medicalConditions: "",
    previousSchool: ""
  });

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

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .eq('profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.warn('Student profile not found:', error);
        return;
      }

      if (student) {
        setStudentInfo({
          name: student.profiles?.full_name || "Student",
          class: student.class || "",
          admissionNumber: student.student_id || "",
          currentTerm: "First Term 2024/2025",
          email: student.profiles?.email || "",
          address: student.address || "",
          parentContact: student.parent_contact || "",
          dateOfBirth: (student as any).date_of_birth || "",
          gender: (student as any).gender || "",
          bloodGroup: (student as any).blood_group || "",
          medicalConditions: (student as any).medical_conditions || "",
          previousSchool: (student as any).previous_school || ""
        });
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
    setProfileForm({ 
      name: studentInfo.name, 
      class: studentInfo.class,
      email: studentInfo.email,
      address: studentInfo.address,
      parentContact: studentInfo.parentContact,
      dateOfBirth: studentInfo.dateOfBirth,
      gender: studentInfo.gender,
      bloodGroup: studentInfo.bloodGroup,
      medicalConditions: studentInfo.medicalConditions,
      previousSchool: studentInfo.previousSchool
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update student record
      const { error: studentError } = await supabase
        .from('students')
        .update({
          class: profileForm.class,
          address: profileForm.address,
          parent_contact: profileForm.parentContact,
          date_of_birth: profileForm.dateOfBirth || null,
          gender: profileForm.gender || null,
          blood_group: profileForm.bloodGroup || null,
          medical_conditions: profileForm.medicalConditions || null,
          previous_school: profileForm.previousSchool || null
        })
        .eq('profile_id', user.id);

      if (studentError) {
        console.warn('Student update error:', studentError);
      }

      // Update profile if name or email changed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.name,
          email: profileForm.email
        })
        .eq('id', user.id);

      if (profileError) {
        console.warn('Profile update error:', profileError);
      }

      setStudentInfo(prev => ({ 
        ...prev, 
        name: profileForm.name,
        class: profileForm.class,
        email: profileForm.email,
        address: profileForm.address,
        parentContact: profileForm.parentContact,
        dateOfBirth: profileForm.dateOfBirth,
        gender: profileForm.gender,
        bloodGroup: profileForm.bloodGroup,
        medicalConditions: profileForm.medicalConditions,
        previousSchool: profileForm.previousSchool
      }));
      setEditingProfile(false);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Edit your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                {editingProfile ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Select value={profileForm.class} onValueChange={(value) => setProfileForm(prev => ({ ...prev, class: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JSS 1">JSS 1</SelectItem>
                              <SelectItem value="JSS 2">JSS 2</SelectItem>
                              <SelectItem value="JSS 3">JSS 3</SelectItem>
                              <SelectItem value="SSS 1">SSS 1</SelectItem>
                              <SelectItem value="SSS 2">SSS 2</SelectItem>
                              <SelectItem value="SSS 3">SSS 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentContact">Parent Contact</Label>
                          <Input
                            id="parentContact"
                            value={profileForm.parentContact}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, parentContact: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileForm.dateOfBirth}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={profileForm.gender} onValueChange={(value) => setProfileForm(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup">Blood Group</Label>
                          <Select value={profileForm.bloodGroup} onValueChange={(value) => setProfileForm(prev => ({ ...prev, bloodGroup: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="previousSchool">Previous School</Label>
                          <Input
                            id="previousSchool"
                            value={profileForm.previousSchool}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, previousSchool: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions</Label>
                      <Textarea
                        id="medicalConditions"
                        value={profileForm.medicalConditions}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, medicalConditions: e.target.value }))}
                        rows={3}
                        placeholder="Any medical conditions or allergies"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProfile(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Full Name</Label>
                          <p className="font-medium">{studentInfo.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Email</Label>
                          <p className="font-medium">{studentInfo.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Class</Label>
                          <p className="font-medium">{studentInfo.class}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Parent Contact</Label>
                          <p className="font-medium">{studentInfo.parentContact || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                          <p className="font-medium">{studentInfo.dateOfBirth || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Gender</Label>
                          <p className="font-medium">{studentInfo.gender || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Blood Group</Label>
                          <p className="font-medium">{studentInfo.bloodGroup || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Previous School</Label>
                          <p className="font-medium">{studentInfo.previousSchool || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Address</Label>
                      <p className="font-medium">{studentInfo.address || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Medical Conditions</Label>
                      <p className="font-medium">{studentInfo.medicalConditions || 'None reported'}</p>
                    </div>

                    <Button onClick={handleEditProfile}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
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
                    <p>Additional learning resources will be available soon.</p>
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
                  <p>Progress tracking will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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