import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { LessonPlanModal } from "@/components/LessonPlanModal";
import { AttendanceModal } from "@/components/AttendanceModal";
import { MessageModal } from "@/components/MessageModal";
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
  Send,
  Download,
  Eye,
  BarChart
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
  Calendar, Users, FileText, BookOpen, CheckSquare, MessageSquare, BarChart
};

const StaffPortalContent = () => {
  const [portalSections, setPortalSections] = useState<PortalSection[]>([]);
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Mathematics Assignment 1", class: "JSS 2A", dueDate: "2025-01-25", status: "Active", subject: "Mathematics" },
    { id: 2, title: "Science Project", class: "SSS 1B", dueDate: "2025-01-30", status: "Active", subject: "Physics" },
    { id: 3, title: "English Essay", class: "JSS 3C", dueDate: "2025-01-20", status: "Graded", subject: "English" }
  ]);
  
  const [students, setStudents] = useState([
    { id: 1, name: "Adebayo Oladimeji", class: "JSS 2A", grade: "A", attendance: 95 },
    { id: 2, name: "Chinyere Okafor", class: "SSS 1B", grade: "B+", attendance: 92 },
    { id: 3, name: "Emeka Nwankwo", class: "JSS 3C", grade: "A-", attendance: 88 },
    { id: 4, name: "Fatima Mohammed", class: "JSS 2A", grade: "B+", attendance: 90 },
    { id: 5, name: "Kemi Adebowale", class: "SSS 1A", grade: "A-", attendance: 93 },
    { id: 6, name: "Chioma Okwu", class: "JSS 3B", grade: "B", attendance: 87 },
    { id: 7, name: "Ibrahim Suleiman", class: "SSS 2A", grade: "A", attendance: 96 },
    { id: 8, name: "Blessing Eze", class: "JSS 1A", grade: "B+", attendance: 89 }
  ]);

  const [lessonPlans, setLessonPlans] = useState([
    { id: 1, title: "Introduction to Quadratic Equations", subject: "Mathematics", class: "JSS 2A", date: "2025-01-22", duration: "45 minutes", objectives: "Students will understand basic quadratic equations", activities: "Interactive whiteboard demonstration", materials: "Textbook, calculator", assessment: "Class participation and quiz" },
    { id: 2, title: "Newton's Laws of Motion", subject: "Physics", class: "SSS 1B", date: "2025-01-23", duration: "60 minutes", objectives: "Explain the three laws of motion", activities: "Practical experiments", materials: "Lab equipment", assessment: "Lab report" }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, class: "JSS 2A", subject: "Mathematics", date: "2025-01-20", presentCount: 28, totalCount: 30 },
    { id: 2, class: "SSS 1B", subject: "Physics", date: "2025-01-20", presentCount: 25, totalCount: 27 },
    { id: 3, class: "JSS 3C", subject: "English", date: "2025-01-19", presentCount: 32, totalCount: 35 }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, type: "academic_progress", subject: "Math Progress Update", recipientCount: 5, sentAt: "2025-01-20T10:30:00Z" },
    { id: 2, type: "assignment_reminder", subject: "Physics Assignment Due Tomorrow", recipientCount: 12, sentAt: "2025-01-19T14:15:00Z" }
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

  // Modal states
  const [showLessonPlanModal, setShowLessonPlanModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<any>(null);

  const todaysSchedule = [
    { time: "8:00 AM", subject: "Mathematics", class: "JSS 2A", room: "Room 12" },
    { time: "10:00 AM", subject: "English Language", class: "SSS 1B", room: "Room 8" },
    { time: "12:00 PM", subject: "Physics", class: "SSS 3A", room: "Lab 2" },
    { time: "2:00 PM", subject: "Free Period", class: "-", room: "-" },
  ];

  useEffect(() => {
    fetchPortalSections();
  }, []);

  const fetchPortalSections = async () => {
    try {
      const { data, error } = await supabase
        .from('portal_sections')
        .select('*')
        .eq('portal_type', 'staff')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPortalSections(data || []);
    } catch (error) {
      console.error('Error fetching portal sections:', error);
      // Fallback to default sections if table not accessible yet
      setPortalSections([
        { id: '1', section_key: 'schedule', title: 'Schedule', description: 'Your classes and timetable', icon: 'Calendar', order_index: 1, is_visible: true, content_type: 'schedule' },
        { id: '2', section_key: 'students', title: 'Students', description: 'View and manage your students', icon: 'Users', order_index: 2, is_visible: true, content_type: 'students' },
        { id: '3', section_key: 'assignments', title: 'Assignments', description: 'Create and manage assignments', icon: 'FileText', order_index: 3, is_visible: true, content_type: 'assignments' }
      ]);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2 text-primary" /> : <FileText className="h-5 w-5 mr-2 text-primary" />;
  };

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

  const handleCreateLessonPlan = () => {
    setSelectedLessonPlan(null);
    setShowLessonPlanModal(true);
  };

  const handleEditLessonPlan = (lessonPlan: any) => {
    setSelectedLessonPlan(lessonPlan);
    setShowLessonPlanModal(true);
  };

  const handleSaveLessonPlan = (lessonPlanData: any) => {
    if (selectedLessonPlan) {
      setLessonPlans(prev => prev.map(lp => 
        lp.id === selectedLessonPlan.id ? { ...lp, ...lessonPlanData } : lp
      ));
    } else {
      const newLessonPlan = {
        id: Date.now(),
        ...lessonPlanData
      };
      setLessonPlans(prev => [...prev, newLessonPlan]);
    }
  };

  const handleDeleteLessonPlan = (id: number) => {
    setLessonPlans(prev => prev.filter(lp => lp.id !== id));
    toast({
      title: "Lesson Plan Deleted",
      description: "Lesson plan has been removed.",
    });
  };

  const handleMarkAttendance = () => {
    setShowAttendanceModal(true);
  };

  const handleSaveAttendance = (attendanceData: any) => {
    const newRecord = {
      id: Date.now(),
      ...attendanceData
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const handleSendMessage = () => {
    setShowMessageModal(true);
  };

  const handleSendMessageData = (messageData: any) => {
    const newMessage = {
      id: Date.now(),
      ...messageData,
      recipientCount: messageData.recipients?.length || 0
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleExportGrades = () => {
    const csvData = [
      ["Student Name", "Class", "Grade", "Attendance %"],
      ...students.map(student => [
        student.name,
        student.class,
        student.grade,
        student.attendance
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grades_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Grades Exported",
      description: "Grade records have been downloaded as CSV file.",
    });
  };

  const handleGenerateAttendanceReport = () => {
    const reportData = [
      ["Class", "Subject", "Date", "Present", "Total", "Attendance %"],
      ...attendanceRecords.map(record => [
        record.class,
        record.subject,
        record.date,
        record.presentCount,
        record.totalCount,
        `${Math.round((record.presentCount / record.totalCount) * 100)}%`
      ])
    ];

    const csvContent = reportData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Attendance report has been downloaded.",
    });
  };

  const renderSectionContent = (section: PortalSection) => {
    switch (section.content_type) {
      case 'schedule':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {renderIcon(section.icon)}
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
                <Button onClick={handleMarkAttendance} className="w-full justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button onClick={handleCreateLessonPlan} variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Lesson Plan
                </Button>
                <Button onClick={handleSendMessage} variant="outline" className="w-full justify-start">
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
        );

      case 'students':
        return (
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
                            className="w-24"
                          />
                          <Button size="sm" onClick={() => handleSaveStudentGrade(student.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingStudent(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="mt-1">Grade: {student.grade}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStudentGrade(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Assignment Management</h2>
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
          </div>
        );

      case 'lessons':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Lesson Plans ({lessonPlans.length})</h2>
              <Button onClick={handleCreateLessonPlan} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Lesson Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lessonPlans.map((lessonPlan) => (
                <Card key={lessonPlan.id} className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{lessonPlan.title}</CardTitle>
                        <CardDescription>{lessonPlan.subject} - {lessonPlan.class}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditLessonPlan(lessonPlan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteLessonPlan(lessonPlan.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{lessonPlan.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{lessonPlan.duration}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">Objectives:</p>
                        <p className="text-sm">{lessonPlan.objectives}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Attendance Records</h2>
              <Button onClick={handleMarkAttendance} className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance ({attendanceRecords.length})</CardTitle>
                <CardDescription>Track student attendance across your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-semibold">{record.class} - {record.subject}</h3>
                        <p className="text-sm text-muted-foreground">Date: {record.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Present</p>
                          <p className="font-bold text-green-600">{record.presentCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-bold">{record.totalCount}</p>
                        </div>
                        <Badge variant={
                          ((record.presentCount / record.totalCount) * 100) >= 85 ? "default" : 
                          ((record.presentCount / record.totalCount) * 100) >= 70 ? "secondary" : "destructive"
                        }>
                          {Math.round((record.presentCount / record.totalCount) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Messages to Parents</h2>
              <Button onClick={handleSendMessage} className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sent Messages ({messages.length})</CardTitle>
                <CardDescription>Track your communication with parents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-semibold">{message.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {message.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • 
                          Sent: {new Date(message.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{message.recipientCount} recipients</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Academic Reports</CardTitle>
              <CardDescription>Generate and view student performance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGenerateAttendanceReport} variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Generate Attendance Report
              </Button>
              <Button onClick={handleExportGrades} variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Grade Records
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {renderIcon(section.icon)}
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Content for {section.title} will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
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

        {portalSections.length > 0 && (
          <Tabs defaultValue={portalSections[0]?.section_key || "schedule"} className="space-y-6">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(portalSections.length, 7)}, minmax(0, 1fr))` }}>
              {portalSections.map((section) => (
                <TabsTrigger key={section.section_key} value={section.section_key}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {portalSections.map((section) => (
              <TabsContent key={section.section_key} value={section.section_key} className="space-y-6">
                {renderSectionContent(section)}
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

      {/* Modals */}
      <LessonPlanModal
        isOpen={showLessonPlanModal}
        onClose={() => setShowLessonPlanModal(false)}
        onSave={handleSaveLessonPlan}
        lessonPlan={selectedLessonPlan}
      />

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        onSave={handleSaveAttendance}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessageData}
      />
    </div>
  );
};

const StaffPortal = () => {
  return (
    <AuthGuard portalType="staff">
      <StaffPortalContent />
    </AuthGuard>
  );
};

export default StaffPortal;