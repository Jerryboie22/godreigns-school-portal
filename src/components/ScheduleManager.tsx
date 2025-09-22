import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Clock, MapPin } from "lucide-react";

interface LessonSchedule {
  id: string;
  subject: string;
  class_level: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
  notes?: string;
}

interface ScheduleManagerProps {
  isAdmin?: boolean;
  staffId?: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
];

export function ScheduleManager({ isAdmin = false, staffId }: ScheduleManagerProps) {
  const [schedules, setSchedules] = useState<LessonSchedule[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<LessonSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    subject: '',
    class_level: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: '',
    notes: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, [staffId]);

  const fetchSchedules = async () => {
    try {
      let query = supabase.from('lesson_schedules').select('*');
      
      if (!isAdmin && staffId) {
        query = query.eq('staff_id', staffId);
      }
      
      const { data, error } = await query.order('day_of_week').order('start_time');
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      class_level: '',
      day_of_week: '',
      start_time: '',
      end_time: '',
      room: '',
      notes: ''
    });
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: LessonSchedule) => {
    setFormData({
      subject: schedule.subject,
      class_level: schedule.class_level,
      day_of_week: schedule.day_of_week.toString(),
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      room: schedule.room || '',
      notes: schedule.notes || ''
    });
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const scheduleData = {
        subject: formData.subject,
        class_level: formData.class_level,
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room || null,
        notes: formData.notes || null,
        staff_id: staffId || userData.user.id
      };

      if (editingSchedule) {
        const { error } = await supabase
          .from('lesson_schedules')
          .update(scheduleData)
          .eq('id', editingSchedule.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Schedule updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('lesson_schedules')
          .insert(scheduleData);
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Schedule created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save schedule",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const { error } = await supabase
        .from('lesson_schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Schedule deleted successfully"
      });
      
      fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const getDayLabel = (dayNumber: number) => {
    return DAYS_OF_WEEK.find(day => day.value === dayNumber)?.label || 'Unknown';
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const day = schedule.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {} as Record<number, LessonSchedule[]>);

  if (loading) {
    return <div className="text-center py-8">Loading schedules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lesson Schedule</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Lesson' : 'Add New Lesson'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="class_level">Class Level</Label>
                <Input
                  id="class_level"
                  value={formData.class_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, class_level: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="day_of_week">Day of Week</Label>
                <Select value={formData.day_of_week} onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(day => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="room">Room (Optional)</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSchedule ? 'Update' : 'Create'} Lesson
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DAYS_OF_WEEK.map(day => (
          <Card key={day.value}>
            <CardHeader>
              <CardTitle className="text-lg">{day.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupedSchedules[day.value]?.map(schedule => (
                  <div key={schedule.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm">{schedule.subject}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {schedule.class_level}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(schedule)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                    </div>
                    
                    {schedule.room && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {schedule.room}
                      </div>
                    )}
                    
                    {schedule.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {schedule.notes}
                      </p>
                    )}
                  </div>
                ))}
                {!groupedSchedules[day.value]?.length && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No lessons scheduled
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}