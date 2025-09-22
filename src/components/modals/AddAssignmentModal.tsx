import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface AddAssignmentModalProps {
  onAssignmentAdded: () => void;
}

const AddAssignmentModal = ({ onAssignmentAdded }: AddAssignmentModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    class_level: "",
    due_date: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('assignments')
        .insert({
          teacher_id: user.id,
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          class_level: formData.class_level,
          due_date: formData.due_date || null
        });

      if (error) throw error;

      toast({
        title: "Assignment Added",
        description: "Your assignment has been created successfully.",
      });

      setFormData({
        title: "",
        description: "",
        subject: "",
        class_level: "",
        due_date: ""
      });
      setOpen(false);
      onAssignmentAdded();
    } catch (error) {
      console.error('Error adding assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter assignment title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Geography">Geography</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class_level">Class Level</Label>
            <Select
              value={formData.class_level}
              onValueChange={(value) => setFormData(prev => ({ ...prev, class_level: value }))}
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
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter assignment instructions..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentModal;