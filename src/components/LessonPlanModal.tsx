import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LessonPlan {
  id: number;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: string;
  objectives: string;
  activities: string;
  materials: string;
  assessment: string;
}

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonPlan: Omit<LessonPlan, "id">) => void;
  lessonPlan?: LessonPlan;
}

export const LessonPlanModal = ({ isOpen, onClose, onSave, lessonPlan }: LessonPlanModalProps) => {
  const [formData, setFormData] = useState({
    title: lessonPlan?.title || "",
    subject: lessonPlan?.subject || "",
    class: lessonPlan?.class || "",
    date: lessonPlan?.date || "",
    duration: lessonPlan?.duration || "",
    objectives: lessonPlan?.objectives || "",
    activities: lessonPlan?.activities || "",
    materials: lessonPlan?.materials || "",
    assessment: lessonPlan?.assessment || ""
  });

  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.class || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setFormData({
      title: "",
      subject: "",
      class: "",
      date: "",
      duration: "",
      objectives: "",
      activities: "",
      materials: "",
      assessment: ""
    });
    onClose();
    
    toast({
      title: "Lesson Plan Saved",
      description: "Your lesson plan has been created successfully.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lessonPlan ? "Edit" : "Create"} Lesson Plan</DialogTitle>
          <DialogDescription>
            Design your lesson plan with clear objectives and activities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Introduction to Algebra"
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={formData.class} onValueChange={(value) => handleChange("class", value)}>
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
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="45 minutes">45 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">Learning Objectives</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => handleChange("objectives", e.target.value)}
              placeholder="What should students learn by the end of this lesson?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activities">Learning Activities</Label>
            <Textarea
              id="activities"
              value={formData.activities}
              onChange={(e) => handleChange("activities", e.target.value)}
              placeholder="Describe the activities and teaching methods you'll use..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials">Materials Needed</Label>
            <Textarea
              id="materials"
              value={formData.materials}
              onChange={(e) => handleChange("materials", e.target.value)}
              placeholder="List books, equipment, and resources needed..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment">Assessment Methods</Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) => handleChange("assessment", e.target.value)}
              placeholder="How will you assess student understanding?"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Lesson Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};