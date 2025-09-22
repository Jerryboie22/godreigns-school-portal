import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  student_id?: string;
  class_level?: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  created_at: string;
  updated_at: string;
}

interface StudentsManagerProps {
  isAdmin: boolean;
}

export const StudentsManager = ({ isAdmin }: StudentsManagerProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    student_id: "",
    class_level: "",
    parent_name: "",
    parent_email: "",
    parent_phone: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      student_id: student.student_id || "",
      class_level: student.class_level || "",
      parent_name: student.parent_name || "",
      parent_email: student.parent_email || "",
      parent_phone: student.parent_phone || ""
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Student name is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingStudent) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingStudent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Student updated successfully.",
        });
      } else {
        // Create new student
        const { error } = await supabase
          .from('students')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Student added successfully.",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: "Failed to save student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });
      
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      student_id: "",
      class_level: "",
      parent_name: "",
      parent_email: "",
      parent_phone: ""
    });
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Students Management</CardTitle>
              <CardDescription>
                {isAdmin ? 'View and manage all students' : 'Add and edit student information'}
              </CardDescription>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </DialogTitle>
                <DialogDescription>
                  {editingStudent ? 'Update student information.' : 'Enter the student details below.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input
                      placeholder="Full Name *"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Student ID"
                    value={formData.student_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  />
                  <Input
                    placeholder="Class Level"
                    value={formData.class_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, class_level: e.target.value }))}
                  />
                  <div className="col-span-2">
                    <Input
                      placeholder="Parent/Guardian Name"
                      value={formData.parent_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
                    />
                  </div>
                  <Input
                    placeholder="Parent Email"
                    type="email"
                    value={formData.parent_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
                  />
                  <Input
                    placeholder="Parent Phone"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStudent ? 'Update' : 'Add'} Student
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found. Add some students to get started.
            </div>
          ) : (
            students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{student.full_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.student_id && <Badge variant="outline">ID: {student.student_id}</Badge>}
                    {student.class_level && <Badge variant="secondary">{student.class_level}</Badge>}
                  </div>
                  {student.parent_name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Parent: {student.parent_name}
                      {student.parent_email && ` (${student.parent_email})`}
                      {student.parent_phone && ` - ${student.parent_phone}`}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};