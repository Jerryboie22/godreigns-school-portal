import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface AddChildModalProps {
  onChildAdded: () => void;
}

const AddChildModal = ({ onChildAdded }: AddChildModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    child_name: "",
    class_level: "",
    admission_number: "",
    current_gpa: "",
    attendance_percentage: "100",
    outstanding_fees: "0"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('children_records')
        .insert({
          parent_id: user.id,
          child_name: formData.child_name,
          class_level: formData.class_level,
          admission_number: formData.admission_number || null,
          current_gpa: formData.current_gpa ? parseFloat(formData.current_gpa) : null,
          attendance_percentage: parseFloat(formData.attendance_percentage),
          outstanding_fees: parseFloat(formData.outstanding_fees)
        });

      if (error) throw error;

      toast({
        title: "Child Record Added",
        description: "Your child's record has been added successfully.",
      });

      setFormData({
        child_name: "",
        class_level: "",
        admission_number: "",
        current_gpa: "",
        attendance_percentage: "100",
        outstanding_fees: "0"
      });
      
      setOpen(false);
      onChildAdded();
    } catch (error) {
      console.error('Error adding child record:', error);
      toast({
        title: "Error",
        description: "Failed to add child record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Child Record</DialogTitle>
          <DialogDescription>
            Add your child's academic record to track their progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="child_name">Child's Name</Label>
              <Input
                id="child_name"
                value={formData.child_name}
                onChange={(e) => handleInputChange("child_name", e.target.value)}
                placeholder="e.g., Sarah Johnson"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_level">Class Level</Label>
              <Input
                id="class_level"
                value={formData.class_level}
                onChange={(e) => handleInputChange("class_level", e.target.value)}
                placeholder="e.g., Grade 10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admission_number">Admission Number (Optional)</Label>
            <Input
              id="admission_number"
              value={formData.admission_number}
              onChange={(e) => handleInputChange("admission_number", e.target.value)}
              placeholder="e.g., ADM2024001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_gpa">Current GPA (Optional)</Label>
              <Input
                id="current_gpa"
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.current_gpa}
                onChange={(e) => handleInputChange("current_gpa", e.target.value)}
                placeholder="e.g., 3.8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance_percentage">Attendance %</Label>
              <Input
                id="attendance_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.attendance_percentage}
                onChange={(e) => handleInputChange("attendance_percentage", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outstanding_fees">Outstanding Fees (₦)</Label>
            <Input
              id="outstanding_fees"
              type="number"
              min="0"
              value={formData.outstanding_fees}
              onChange={(e) => handleInputChange("outstanding_fees", e.target.value)}
              required
            />
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
              {loading ? "Adding..." : "Add Child"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildModal;