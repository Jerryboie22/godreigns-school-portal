import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentAdded: () => void;
}

export const AddAssignmentModal = ({ isOpen, onClose, onAssignmentAdded }: AddAssignmentModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    class_level: "",
    due_date: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.class_level) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from('assignments')
        .insert({
          title: formData.title,
          subject: formData.subject,
          class_level: formData.class_level,
          due_date: formData.due_date || null,
          description: formData.description || null,
          teacher_id: userData.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment created successfully",
      });

      // Reset form
      setFormData({
        title: "",
        subject: "",
        class_level: "",
        due_date: "",
        description: ""
      });

      onAssignmentAdded();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Create an assignment for your students.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Quadratic Equations Worksheet"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English Language</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class_level">Class *</Label>
              <Select value={formData.class_level} onValueChange={(value) => handleChange("class_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSS 1A">JSS 1A</SelectItem>
                  <SelectItem value="JSS 1B">JSS 1B</SelectItem>
                  <SelectItem value="JSS 2A">JSS 2A</SelectItem>
                  <SelectItem value="JSS 2B">JSS 2B</SelectItem>
                  <SelectItem value="JSS 3A">JSS 3A</SelectItem>
                  <SelectItem value="JSS 3B">JSS 3B</SelectItem>
                  <SelectItem value="SSS 1A">SSS 1A</SelectItem>
                  <SelectItem value="SSS 1B">SSS 1B</SelectItem>
                  <SelectItem value="SSS 2A">SSS 2A</SelectItem>
                  <SelectItem value="SSS 2B">SSS 2B</SelectItem>
                  <SelectItem value="SSS 3A">SSS 3A</SelectItem>
                  <SelectItem value="SSS 3B">SSS 3B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Assignment Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide detailed instructions for the assignment..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};