import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Award,
  Clock,
  FileText,
  User,
  Phone,
  Edit
} from "lucide-react";

const ParentPortalContent = () => {
  const [childInfo, setChildInfo] = useState({
    name: "Chioma Okafor",
    class: "JSS 2A",
    admissionNumber: "OGR/2023/1234",
    photo: "/placeholder-student.jpg"
  });
  const [editingChild, setEditingChild] = useState(false);
  const [childForm, setChildForm] = useState({ name: "", class: "" });

  const recentGrades = [
    { subject: "Mathematics", score: "85%", grade: "B+", date: "2024-09-15" },
    { subject: "English Language", score: "92%", grade: "A", date: "2024-09-12" },
    { subject: "Basic Science", score: "78%", grade: "B", date: "2024-09-10" },
    { subject: "Social Studies", score: "88%", grade: "B+", date: "2024-09-08" },
  ];

  const handleEditChild = () => {
    setEditingChild(true);
    setChildForm({ name: childInfo.name, class: childInfo.class });
  };

  const handleSaveChild = () => {
    setChildInfo(prev => ({ ...prev, ...childForm }));
    setEditingChild(false);
  };

  const upcomingEvents = [
    { event: "Parent-Teacher Conference", date: "2024-09-25", time: "10:00 AM" },
    { event: "Inter-House Sports", date: "2024-09-30", time: "8:00 AM" },
    { event: "Mid-term Break Begins", date: "2024-10-05", time: "2:00 PM" },
  ];

  const feeStructure = [
    { item: "School Fees", amount: "₦45,000", status: "Paid", dueDate: "2024-09-01" },
    { item: "Uniform", amount: "₦8,500", status: "Paid", dueDate: "2024-08-15" },
    { item: "Books & Materials", amount: "₦12,000", status: "Pending", dueDate: "2024-09-30" },
    { item: "Extra-curricular", amount: "₦5,000", status: "Pending", dueDate: "2024-10-15" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Heart className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-accent-foreground/90">Monitor your child's academic journey</p>
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
                <User className="h-6 w-6 text-accent" />
                <span>Student Information</span>
              </div>
              <Button variant="outline" size="sm" onClick={editingChild ? handleSaveChild : handleEditChild}>
                <Edit className="h-4 w-4 mr-2" />
                {editingChild ? 'Save' : 'Edit'}
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
                  {editingChild ? (
                    <Input
                      value={childForm.name}
                      onChange={(e) => setChildForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Student Name"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{childInfo.name}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  {editingChild ? (
                    <Input
                      value={childForm.class}
                      onChange={(e) => setChildForm(prev => ({ ...prev, class: e.target.value }))}
                      placeholder="Class"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{childInfo.class}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Number</p>
                  <p className="font-medium text-foreground">{childInfo.admissionNumber}</p>
                </div>
              </div>
              {editingChild && (
                <Button variant="outline" onClick={() => setEditingChild(false)}>
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
                  <p className="text-muted-foreground text-sm">Overall Grade</p>
                  <p className="text-2xl font-bold text-foreground">B+</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Attendance</p>
                  <p className="text-2xl font-bold text-foreground">95%</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Outstanding Fees</p>
                  <p className="text-2xl font-bold text-foreground">₦17,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Messages</p>
                  <p className="text-2xl font-bold text-foreground">2</p>
                </div>
                <MessageSquare className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="communication">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Recent Academic Performance</span>
                </CardTitle>
                <CardDescription>Latest grades and assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{grade.subject}</h4>
                        <p className="text-sm text-muted-foreground">Date: {grade.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{grade.score}</p>
                        <Badge variant={grade.grade.startsWith('A') ? 'default' : grade.grade.startsWith('B') ? 'secondary' : 'outline'}>
                          {grade.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span>Attendance Record</span>
                </CardTitle>
                <CardDescription>Daily attendance and punctuality tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed attendance tracking available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable real-time attendance monitoring.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span>Fee Structure & Payments</span>
                </CardTitle>
                <CardDescription>School fees and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeStructure.map((fee, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{fee.item}</h4>
                        <p className="text-sm text-muted-foreground">Due: {fee.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{fee.amount}</p>
                        <Badge variant={fee.status === 'Paid' ? 'default' : 'secondary'}>
                          {fee.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Link to="/school-fees">
                      <Button className="w-full">Pay School Fees</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>School Events & Calendar</span>
                </CardTitle>
                <CardDescription>Upcoming school activities and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{event.event}</h4>
                        <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-navy" />
                  <span>Messages & Communication</span>
                </CardTitle>
                <CardDescription>Messages from teachers and school administration</CardDescription>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Messaging system available with backend integration.</p>
                  <p className="text-sm mt-2">Connect to Supabase to enable real-time communication with teachers.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-accent" />
              <div>
                <h3 className="font-semibold text-accent">Stay Connected with Your Child's Education</h3>
                <p className="text-muted-foreground">
                  Connect to Supabase to unlock real-time updates on grades, attendance, 
                  school events, and direct communication with teachers and staff.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ParentPortal = () => {
  return (
    <AuthGuard portalType="parent">
      <ParentPortalContent />
    </AuthGuard>
  );
};

export default ParentPortal;