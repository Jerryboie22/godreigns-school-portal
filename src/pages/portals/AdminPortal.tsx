import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  FileText, 
  BarChart3, 
  Bell, 
  UserPlus,
  GraduationCap,
  DollarSign,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const AdminPortalContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStudents, setActiveStudents] = useState([
    { id: 1, name: "Adebayo Oladimeji", class: "JSS 1A", admissionNo: "2023/001", status: "Active" },
    { id: 2, name: "Chinyere Okafor", class: "SSS 2B", admissionNo: "2021/045", status: "Active" },
    { id: 3, name: "Emeka Nwankwo", class: "JSS 3C", admissionNo: "2022/023", status: "Suspended" }
  ]);
  const [staff, setStaff] = useState([
    { id: 1, name: "Mrs. Folake Adebisi", position: "English Teacher", department: "Languages", status: "Active" },
    { id: 2, name: "Mr. Chukwuma Okonkwo", position: "Mathematics Teacher", department: "Sciences", status: "Active" },
    { id: 3, name: "Miss Aisha Bello", position: "Physics Teacher", department: "Sciences", status: "On Leave" }
  ]);
  const { toast } = useToast();

  const handleAction = (action: string, id?: number) => {
    toast({
      title: `${action} Successful`,
      description: `Action "${action}" has been completed successfully.`,
    });
  };

  const handleDeleteStudent = (id: number) => {
    setActiveStudents(prev => prev.filter(student => student.id !== id));
    toast({
      title: "Student Removed",
      description: "Student has been removed from the system.",
    });
  };

  const handleDeleteStaff = (id: number) => {
    setStaff(prev => prev.filter(member => member.id !== id));
    toast({
      title: "Staff Removed", 
      description: "Staff member has been removed from the system.",
    });
  };

  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editingStaff, setEditingStaff] = useState<number | null>(null);
  const [studentForm, setStudentForm] = useState({ name: "", class: "", admissionNo: "", status: "" });
  const [staffForm, setStaffForm] = useState({ name: "", position: "", department: "", status: "" });

  const handleAddStudent = () => {
    const newStudent = {
      id: Date.now(),
      name: `Kemi Adeyemi`,
      class: "JSS 1A",
      admissionNo: `2025/${String(activeStudents.length + 1).padStart(3, '0')}`,
      status: "Active"
    };
    setActiveStudents(prev => [...prev, newStudent]);
    toast({
      title: "Student Added",
      description: "New student has been added to the system.",
    });
  };

  const handleAddStaff = () => {
    const newStaff = {
      id: Date.now(),
      name: `Dr. Musa Ibrahim`,
      position: "Teacher",
      department: "General",
      status: "Active"
    };
    setStaff(prev => [...prev, newStaff]);
    toast({
      title: "Staff Added",
      description: "New staff member has been added to the system.",
    });
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student.id);
    setStudentForm({
      name: student.name,
      class: student.class,
      admissionNo: student.admissionNo,
      status: student.status
    });
  };

  const handleSaveStudent = (id: number) => {
    setActiveStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...studentForm } : student
    ));
    setEditingStudent(null);
    toast({
      title: "Student Updated",
      description: "Student information has been updated successfully.",
    });
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember.id);
    setStaffForm({
      name: staffMember.name,
      position: staffMember.position,
      department: staffMember.department,
      status: staffMember.status
    });
  };

  const handleSaveStaff = (id: number) => {
    setStaff(prev => prev.map(member => 
      member.id === id ? { ...member, ...staffForm } : member
    ));
    setEditingStaff(null);
    toast({
      title: "Staff Updated",
      description: "Staff information has been updated successfully.",
    });
  };

  const quickStats = [
    { label: "Total Students", value: "847", icon: Users, color: "text-primary" },
    { label: "Total Staff", value: "42", icon: GraduationCap, color: "text-secondary" },
    { label: "Classes", value: "24", icon: BookOpen, color: "text-accent" },
    { label: "Revenue (Monthly)", value: "₦2.4M", icon: DollarSign, color: "text-navy" },
  ];

  const recentActivities = [
    { action: "New student enrolled", details: "Adebayo Oladimeji - JSS 1A", time: "2 hours ago" },
    { action: "Staff meeting scheduled", details: "Mathematics Department", time: "4 hours ago" },
    { action: "Fee payment received", details: "₦45,000 from Chinyere Okafor", time: "6 hours ago" },
    { action: "Report generated", details: "Monthly academic performance", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Admin Portal</h1>
              <p className="text-white/90">Comprehensive School Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/admin-cms'}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Content (CMS)
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/blog'}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Blog Posts
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/admin/cms'}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Gallery
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Contact Messages
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/portals'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    All Portals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Student Management</h2>
              <Button onClick={handleAddStudent} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Students ({activeStudents.length})</CardTitle>
                <CardDescription>Manage student records and information</CardDescription>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={() => handleAction("Search Students")}>Search</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeStudents.filter(student => 
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      {editingStudent === student.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={studentForm.name}
                            onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Student Name"
                          />
                          <div className="flex space-x-2">
                            <Input
                              value={studentForm.class}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, class: e.target.value }))}
                              placeholder="Class"
                            />
                            <Input
                              value={studentForm.admissionNo}
                              onChange={(e) => setStudentForm(prev => ({ ...prev, admissionNo: e.target.value }))}
                              placeholder="Admission No"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Class: {student.class} | Admission No: {student.admissionNo}
                          </p>
                          <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        {editingStudent === student.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSaveStudent(student.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingStudent(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleAction("View Student", student.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditStudent(student)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteStudent(student.id)}>
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
          </TabsContent>

          <TabsContent value="staff">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Staff Management</h2>
              <Button onClick={handleAddStaff} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Staff Members ({staff.length})</CardTitle>
                <CardDescription>Manage teaching and non-teaching staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="space-y-4">
                  {staff.filter(member => 
                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.department.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      {editingStaff === member.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={staffForm.name}
                            onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Staff Name"
                          />
                          <div className="flex space-x-2">
                            <Input
                              value={staffForm.position}
                              onChange={(e) => setStaffForm(prev => ({ ...prev, position: e.target.value }))}
                              placeholder="Position"
                            />
                            <Input
                              value={staffForm.department}
                              onChange={(e) => setStaffForm(prev => ({ ...prev, department: e.target.value }))}
                              placeholder="Department"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position} | Department: {member.department}
                          </p>
                          <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        {editingStaff === member.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSaveStaff(member.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingStaff(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleAction("View Staff", member.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditStaff(member)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteStaff(member.id)}>
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
          </TabsContent>

          <TabsContent value="academics">
            <Card>
              <CardHeader>
                <CardTitle>Academic Management</CardTitle>
                <CardDescription>Manage curriculum, assessments, and academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => window.location.href = '/portal/staff'}
                    className="h-24 text-left flex-col items-start p-4"
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">Staff Portal</div>
                      <div className="text-xs opacity-75">Manage teaching</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/library'}
                    className="h-24 text-left flex-col items-start p-4" 
                    variant="outline"
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">Library</div>
                      <div className="text-xs">Manage resources</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/e-learning'}
                    className="h-24 text-left flex-col items-start p-4" 
                    variant="outline"
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">E-Learning</div>
                      <div className="text-xs">Online platform</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Financial Management</CardTitle>
                <CardDescription>Manage fees, payments, and financial records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => window.location.href = '/admin/school-fees'}
                    className="h-24 text-left flex-col items-start p-4"
                  >
                    <DollarSign className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">School Fees</div>
                      <div className="text-xs opacity-75">Payment portal</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/portal/parent'}
                    className="h-24 text-left flex-col items-start p-4" 
                    variant="outline"
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">Parent Portal</div>
                      <div className="text-xs">Fee tracking</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => handleAction("Generate Financial Report")}
                    className="h-24 text-left flex-col items-start p-4" 
                    variant="outline"
                  >
                    <BookOpen className="h-6 w-6 mb-2" />
                    <div>
                      <div className="font-semibold">Reports</div>
                      <div className="text-xs">Financial data</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary">Content Management</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => window.location.href = '/admin-cms'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        CMS Dashboard
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/gallery'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Gallery Management
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/blog'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Blog Posts
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-primary">Portal Access</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => window.location.href = '/portals'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        All Portals
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/contact'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Contact Messages
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/about'}
                        className="w-full justify-start" 
                        variant="outline"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        About Page
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend Integration Notice */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Admin Dashboard</h3>
                <p className="text-muted-foreground">
                  You have full access to all administrative functions. Use the tabs above to manage different aspects of the school system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminPortal = () => {
  return (
    <AuthGuard portalType="admin">
      <AdminPortalContent />
    </AuthGuard>
  );
};

export default AdminPortal;