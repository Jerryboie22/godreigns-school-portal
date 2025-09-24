import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface StudentFormProps {
  student?: any;
  onSave: (studentData: any) => void;
  onCancel: () => void;
}

interface StudentData {
  student_id: string;
  profile_id?: string;
  class: string;
  section: string;
  address: string;
  parent_contact: string;
  admission_date: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  medical_conditions: string;
  previous_school: string;
  full_name: string;
  email: string;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentData>({
    student_id: '',
    class: '',
    section: '',
    address: '',
    parent_contact: '',
    admission_date: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    medical_conditions: '',
    previous_school: '',
    full_name: '',
    email: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        student_id: student.student_id || '',
        profile_id: student.profile_id,
        class: student.class || '',
        section: student.section || '',
        address: student.address || '',
        parent_contact: student.parent_contact || '',
        admission_date: student.admission_date || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || '',
        blood_group: student.blood_group || '',
        medical_conditions: student.medical_conditions || '',
        previous_school: student.previous_school || '',
        full_name: student.full_name || '',
        email: student.email || ''
      });
    }
  }, [student]);

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.full_name || !formData.class || !formData.student_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Class, Student ID).",
          variant: "destructive"
        });
        return;
      }

      if (student) {
        // Update existing student
        const { error: studentError } = await supabase
          .from('students')
          .update({
            student_id: formData.student_id,
            class: formData.class,
            section: formData.section,
            address: formData.address,
            parent_contact: formData.parent_contact,
            admission_date: formData.admission_date || null,
            date_of_birth: formData.date_of_birth || null,
            gender: formData.gender || null,
            blood_group: formData.blood_group || null,
            medical_conditions: formData.medical_conditions || null,
            previous_school: formData.previous_school || null
          })
          .eq('id', student.id);

        if (studentError) throw studentError;

        // Update profile if exists
        if (student.profile_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              email: formData.email
            })
            .eq('id', student.profile_id);

          if (profileError) console.warn('Profile update error:', profileError);
        }

      } else {
        // Create new student
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .insert({
            student_id: formData.student_id,
            class: formData.class,
            section: formData.section,
            address: formData.address,
            parent_contact: formData.parent_contact,
            admission_date: formData.admission_date || null,
            date_of_birth: formData.date_of_birth || null,
            gender: formData.gender || null,
            blood_group: formData.blood_group || null,
            medical_conditions: formData.medical_conditions || null,
            previous_school: formData.previous_school || null
          })
          .select()
          .single();

        if (studentError) throw studentError;
      }

      toast({
        title: "Success",
        description: `Student ${student ? 'updated' : 'created'} successfully.`
      });

      onSave(formData);
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${student ? 'update' : 'create'} student.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">
          {student ? 'Edit Student' : 'Add New Student'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID *</Label>
                <Input
                  id="student_id"
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder="e.g., OGR/2024/001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => handleInputChange('class', value)}
                  >
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
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => handleInputChange('section', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
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
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  value={formData.blood_group}
                  onValueChange={(value) => handleInputChange('blood_group', value)}
                >
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
                <Label htmlFor="admission_date">Admission Date</Label>
                <Input
                  id="admission_date"
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => handleInputChange('admission_date', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact and Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact & Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parent_contact">Parent Contact</Label>
                <Input
                  id="parent_contact"
                  value={formData.parent_contact}
                  onChange={(e) => handleInputChange('parent_contact', e.target.value)}
                  placeholder="Parent phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previous_school">Previous School</Label>
                <Input
                  id="previous_school"
                  value={formData.previous_school}
                  onChange={(e) => handleInputChange('previous_school', e.target.value)}
                  placeholder="Previous school name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Student's home address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Medical Conditions</Label>
              <Textarea
                id="medical_conditions"
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                placeholder="Any medical conditions or allergies"
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};