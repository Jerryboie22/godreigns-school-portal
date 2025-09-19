import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: number;
  name: string;
  class: string;
  parentEmail: string;
  selected?: boolean;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: any) => void;
}

export const MessageModal = ({ isOpen, onClose, onSend }: MessageModalProps) => {
  const [messageType, setMessageType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  
  // Mock student data with parent emails
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Adebayo Oladimeji", class: "JSS 2A", parentEmail: "oladimeji.parent@email.com", selected: false },
    { id: 2, name: "Chinyere Okafor", class: "JSS 2A", parentEmail: "okafor.parent@email.com", selected: false },
    { id: 3, name: "Emeka Nwankwo", class: "JSS 2A", parentEmail: "nwankwo.parent@email.com", selected: false },
    { id: 4, name: "Fatima Mohammed", class: "JSS 2A", parentEmail: "mohammed.parent@email.com", selected: false },
    { id: 5, name: "Kemi Adebowale", class: "JSS 2A", parentEmail: "adebowale.parent@email.com", selected: false },
    { id: 6, name: "Chioma Okwu", class: "JSS 2A", parentEmail: "okwu.parent@email.com", selected: false },
    { id: 7, name: "Ibrahim Suleiman", class: "JSS 2A", parentEmail: "suleiman.parent@email.com", selected: false },
    { id: 8, name: "Blessing Eze", class: "JSS 2A", parentEmail: "eze.parent@email.com", selected: false }
  ]);

  const { toast } = useToast();

  const handleSend = () => {
    if (!messageType || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const selectedStudents = students.filter(s => s.selected);
    if (selectedStudents.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one student/parent to message.",
        variant: "destructive"
      });
      return;
    }

    const messageData = {
      type: messageType,
      class: selectedClass,
      subject,
      message,
      priority,
      recipients: selectedStudents.map(s => ({ 
        studentName: s.name, 
        parentEmail: s.parentEmail 
      })),
      sentAt: new Date().toISOString()
    };

    onSend(messageData);
    
    // Reset form
    setMessageType("");
    setSelectedClass("");
    setSubject("");
    setMessage("");
    setPriority("normal");
    setStudents(prev => prev.map(s => ({ ...s, selected: false })));
    
    onClose();
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedStudents.length} recipient(s)`,
    });
  };

  const toggleStudentSelection = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, selected: !student.selected } : student
    ));
  };

  const selectAllStudents = () => {
    setStudents(prev => prev.map(student => ({ ...student, selected: true })));
  };

  const selectNoneStudents = () => {
    setStudents(prev => prev.map(student => ({ ...student, selected: false })));
  };

  const selectedCount = students.filter(s => s.selected).length;

  // Message templates
  const messageTemplates = {
    "academic_progress": "I wanted to update you on your child's academic progress in my class...",
    "behavioral_notice": "I would like to discuss your child's behavior in class today...",
    "assignment_reminder": "This is a reminder about the upcoming assignment due date...",
    "positive_feedback": "I'm pleased to share some positive feedback about your child's performance...",
    "parent_meeting": "I would like to schedule a meeting to discuss your child's progress...",
    "custom": ""
  };

  const handleMessageTypeChange = (value: string) => {
    setMessageType(value);
    setMessage(messageTemplates[value as keyof typeof messageTemplates] || "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Message to Parents</DialogTitle>
          <DialogDescription>
            Communicate with parents about their children's progress and activities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageType">Message Type *</Label>
              <Select value={messageType} onValueChange={handleMessageTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic_progress">Academic Progress</SelectItem>
                  <SelectItem value="behavioral_notice">Behavioral Notice</SelectItem>
                  <SelectItem value="assignment_reminder">Assignment Reminder</SelectItem>
                  <SelectItem value="positive_feedback">Positive Feedback</SelectItem>
                  <SelectItem value="parent_meeting">Meeting Request</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class (optional)" />
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
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to parents..."
              rows={6}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Recipients</Label>
              <div className="flex gap-2">
                <Badge variant="secondary">Selected: {selectedCount}</Badge>
                <Button size="sm" variant="outline" onClick={selectAllStudents}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={selectNoneStudents}>
                  Select None
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={student.selected}
                        onCheckedChange={() => toggleStudentSelection(student.id)}
                      />
                      <div>
                        <Label htmlFor={`student-${student.id}`} className="cursor-pointer font-medium">
                          {student.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{student.parentEmail}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{student.class}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!messageType || !subject || !message || selectedCount === 0}>
            Send Message ({selectedCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};