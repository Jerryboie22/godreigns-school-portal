import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface AddClassModalProps {
  onClassAdded: () => void;
}

const AddClassModal = ({ onClassAdded }: AddClassModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    class_name: "",
    subject: "",
    teacher_name: "",
    grade: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('enrolled_classes')
        .insert({
          student_id: user.id,
          class_name: formData.class_name,
          subject: formData.subject,
          teacher_name: formData.teacher_name || null,
          grade: formData.grade || null,
          attendance_percentage: 100
        });

      if (error) throw error;

      toast({
        title: "Class Added",
        description: "You have successfully enrolled in this class.",
      });

      setFormData({
        class_name: "",
        subject: "",
        teacher_name: "",
        grade: ""
      });
      
      setOpen(false);
      onClassAdded();
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Enroll in Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enroll in New Class</DialogTitle>
          <DialogDescription>
            Add a new class to your course schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class_name">Class Name</Label>
              <Input
                id="class_name"
                value={formData.class_name}
                onChange={(e) => handleInputChange("class_name", e.target.value)}
                placeholder="e.g., Grade 10A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="e.g., Mathematics"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher_name">Teacher Name (Optional)</Label>
            <Input
              id="teacher_name"
              value={formData.teacher_name}
              onChange={(e) => handleInputChange("teacher_name", e.target.value)}
              placeholder="e.g., Mr. Johnson"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Current Grade (Optional)</Label>
            <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select current grade" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;