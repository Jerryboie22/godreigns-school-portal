import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: number;
  name: string;
  class: string;
  present?: boolean;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attendanceData: any) => void;
}

export const AttendanceModal = ({ isOpen, onClose, onSave }: AttendanceModalProps) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock student data - in real app, this would come from API based on selected class
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Adebayo Oladimeji", class: "JSS 2A", present: true },
    { id: 2, name: "Chinyere Okafor", class: "JSS 2A", present: true },
    { id: 3, name: "Emeka Nwankwo", class: "JSS 2A", present: false },
    { id: 4, name: "Fatima Mohammed", class: "JSS 2A", present: true },
    { id: 5, name: "Kemi Adebowale", class: "JSS 2A", present: true },
    { id: 6, name: "Chioma Okwu", class: "JSS 2A", present: false },
    { id: 7, name: "Ibrahim Suleiman", class: "JSS 2A", present: true },
    { id: 8, name: "Blessing Eze", class: "JSS 2A", present: true }
  ]);

  const { toast } = useToast();

  const handleSave = () => {
    if (!selectedClass || !selectedSubject) {
      toast({
        title: "Missing Information",
        description: "Please select class and subject.",
        variant: "destructive"
      });
      return;
    }

    const attendanceData = {
      class: selectedClass,
      subject: selectedSubject,
      date,
      students: students.map(s => ({ id: s.id, name: s.name, present: s.present })),
      presentCount: students.filter(s => s.present).length,
      totalCount: students.length
    };

    onSave(attendanceData);
    onClose();
    
    toast({
      title: "Attendance Saved",
      description: `Attendance recorded for ${selectedClass} - ${selectedSubject}`,
    });
  };

  const toggleAttendance = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, present: !student.present } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: false })));
  };

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Record student attendance for your class session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              <Label htmlFor="subject">Subject *</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {selectedClass && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">Present: {presentCount}</Badge>
                  <Badge variant="outline">Absent: {absentCount}</Badge>
                  <Badge>Total: {students.length}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={markAllPresent}>
                    Mark All Present
                  </Button>
                  <Button size="sm" variant="outline" onClick={markAllAbsent}>
                    Mark All Absent
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={student.present}
                          onCheckedChange={() => toggleAttendance(student.id)}
                        />
                        <Label htmlFor={`student-${student.id}`} className="cursor-pointer">
                          {student.name}
                        </Label>
                      </div>
                      <Badge variant={student.present ? "default" : "secondary"}>
                        {student.present ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedClass || !selectedSubject}>
            Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};