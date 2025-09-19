import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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
  Plus,
  Edit,
  Trash2,
  Send
} from "lucide-react";

const StaffPortal = () => {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Mathematics Assignment 1", class: "JSS 2A", dueDate: "2025-01-25", status: "Active", subject: "Mathematics" },
    { id: 2, title: "Science Project", class: "SSS 1B", dueDate: "2025-01-30", status: "Active", subject: "Physics" },
    { id: 3, title: "English Essay", class: "JSS 3C", dueDate: "2025-01-20", status: "Graded", subject: "English" }
  ]);
  
  const [students, setStudents] = useState([
    { id: 1, name: "Adebayo Oladimeji", class: "JSS 2A", grade: "A", attendance: 95 },
    { id: 2, name: "Chinyere Okafor", class: "SSS 1B", grade: "B+", attendance: 92 },
    { id: 3, name: "Emeka Nwankwo", class: "JSS 3C", grade: "A-", attendance: 88 }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    class: "",
    dueDate: "",
    description: "",
    subject: ""
  });

  const { toast } = useToast();

  const [editingAssignment, setEditingAssignment] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", class: "", dueDate: "", subject: "" });
  const [studentGradeForm, setStudentGradeForm] = useState({ grade: "" });

  const todaysSchedule = [
    { time: "8:00 AM", subject: "Mathematics", class: "JSS 2A", room: "Room 12" },
    { time: "10:00 AM", subject: "English Language", class: "SSS 1B", room: "Room 8" },
    { time: "12:00 PM", subject: "Physics", class: "SSS 3A", room: "Lab 2" },
    { time: "2:00 PM", subject: "Free Period", class: "-", room: "-" },
  ];

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.class || !newAssignment.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const assignment = {
      id: Date.now(),
      title: newAssignment.title,
      class: newAssignment.class,
      dueDate: newAssignment.dueDate,
      status: "Active",
      subject: newAssignment.subject || "General"
    };

    setAssignments(prev => [...prev, assignment]);
    setNewAssignment({ title: "", class: "", dueDate: "", description: "", subject: "" });
    
    toast({
      title: "Assignment Created",
      description: "New assignment has been created successfully.",
    });
  };

  const handleDeleteAssignment = (id: number) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    toast({
      title: "Assignment Deleted",
      description: "Assignment has been removed.",
    });
  };

  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment.id);
    setAssignmentForm({
      title: assignment.title,
      class: assignment.class,
      dueDate: assignment.dueDate,
      subject: assignment.subject
    });
  };

  const handleSaveAssignment = (id: number) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, ...assignmentForm } : assignment
    ));
    setEditingAssignment(null);
    toast({
      title: "Assignment Updated",
      description: "Assignment has been updated successfully.",
    });
  };

  const handleEditStudentGrade = (student: any) => {
    setEditingStudent(student.id);
    setStudentGradeForm({ grade: student.grade });
  };

  const handleSaveStudentGrade = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, grade: studentGradeForm.grade } : student
    ));
    setEditingStudent(null);
    toast({
      title: "Grade Updated",
      description: "Student grade has been updated successfully.",
    });
  };

  const handleGradeStudent = (studentId: number, newGrade: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, grade: newGrade } : student
    ));
    toast({
      title: "Grade Updated",
      description: "Student grade has been updated successfully.",
    });
  };

  const handleAction = (action: string) => {
    toast({
      title: `${action} Initiated`,
      description: `${action} action has been processed.`,
    });
  };

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
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">7</p>
                </div>
                <MessageSquare className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your classes for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaysSchedule.map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-12 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{schedule.subject}</p>
                            <p className="text-sm text-muted-foreground">{schedule.class} - {schedule.room}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{schedule.time}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-secondary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => handleAction("Mark Attendance")} className="w-full justify-start">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button onClick={() => handleAction("Create Lesson Plan")} variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create Lesson Plan
                  </Button>
                  <Button onClick={() => handleAction("Send Message")} variant="outline" className="w-full justify-start">
                    <Send className="h-4 w-4 mr-2" />
                    Message Parents
                  </Button>
                  <Link to="/e-learning">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      E-Learning Platform
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Students ({students.length})</CardTitle>
                <CardDescription>View and manage your students' progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Class: {student.class} | Attendance: {student.attendance}%
                        </p>
                        {editingStudent === student.id ? (
                          <div className="flex items-center space-x-2 mt-2">
                            <Input
                              value={studentGradeForm.grade}
                              onChange={(e) => setStudentGradeForm({ grade: e.target.value })}
                              placeholder="Enter grade"
                              className="w-20"
                            />
                            <Button size="sm" onClick={() => handleSaveStudentGrade(student.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingStudent(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="outline">Grade: {student.grade}</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditStudentGrade(student)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Grade
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction("Send Message")}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Assignment Management</h2>
              <Button onClick={() => setNewAssignment({ title: "", class: "", dueDate: "", description: "", subject: "" })} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                  <CardDescription>Add assignments for your classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Assignment Title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Subject (e.g., Mathematics)"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Input
                    placeholder="Class (e.g., JSS 2A)"
                    value={newAssignment.class}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, class: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Assignment Description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Button onClick={handleCreateAssignment} className="w-full">
                    Create Assignment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Assignments ({assignments.length})</CardTitle>
                  <CardDescription>Manage your active assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        {editingAssignment === assignment.id ? (
                          <div className="flex-1 space-y-2 mr-4">
                            <Input
                              value={assignmentForm.title}
                              onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Assignment Title"
                            />
                            <div className="flex space-x-2">
                              <Input
                                value={assignmentForm.subject}
                                onChange={(e) => setAssignmentForm(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Subject"
                              />
                              <Input
                                value={assignmentForm.class}
                                onChange={(e) => setAssignmentForm(prev => ({ ...prev, class: e.target.value }))}
                                placeholder="Class"
                              />
                              <Input
                                type="date"
                                value={assignmentForm.dueDate}
                                onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-semibold">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.subject} | Class: {assignment.class} | Due: {assignment.dueDate}
                            </p>
                            <Badge variant={assignment.status === 'Active' ? 'default' : 'secondary'}>
                              {assignment.status}
                            </Badge>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          {editingAssignment === assignment.id ? (
                            <>
                              <Button size="sm" onClick={() => handleSaveAssignment(assignment.id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingAssignment(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEditAssignment(assignment)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteAssignment(assignment.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Resources</CardTitle>
                <CardDescription>Access curriculum materials and teaching aids</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => handleAction("Access Curriculum")} variant="outline" className="h-20 flex flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  Curriculum Guide
                </Button>
                <Button onClick={() => handleAction("View Lesson Plans")} variant="outline" className="h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Lesson Plans
                </Button>
                <Link to="/library">
                  <Button variant="outline" className="h-20 flex flex-col w-full">
                    <Users className="h-6 w-6 mb-2" />
                    Digital Library
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Reports</CardTitle>
                <CardDescription>Generate and view student performance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleAction("Generate Class Report")} className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Class Performance Report
                </Button>
                <Button onClick={() => handleAction("View Attendance Report")} variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Attendance Summary
                </Button>
                <Button onClick={() => handleAction("Export Grades")} variant="outline" className="w-full justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Export Grade Records
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffPortal;