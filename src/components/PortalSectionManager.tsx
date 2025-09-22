import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Edit, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  FileText,
  Users,
  Calendar,
  BookOpen,
  CheckSquare,
  MessageSquare,
  BarChart,
  Trophy,
  Clock,
  Target
} from "lucide-react";

interface PortalSection {
  id: string;
  portal_type: 'staff' | 'student';
  section_key: string;
  title: string;
  description: string | null;
  icon: string;
  order_index: number;
  is_visible: boolean;
  content_type: string;
  custom_content: any;
}

const iconMap = {
  FileText, Users, Calendar, BookOpen, CheckSquare, MessageSquare, 
  BarChart, Trophy, Clock, Target
};

const contentTypes = [
  { value: 'custom', label: 'Custom Content' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'students', label: 'Students' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'grades', label: 'Grades' },
  { value: 'resources', label: 'Resources' },
  { value: 'messages', label: 'Messages' },
  { value: 'reports', label: 'Reports' },
  { value: 'progress', label: 'Progress' },
  { value: 'lessons', label: 'Lesson Plans' },
  { value: 'attendance', label: 'Attendance' }
];

const availableIcons = [
  'FileText', 'Users', 'Calendar', 'BookOpen', 'CheckSquare', 
  'MessageSquare', 'BarChart', 'Trophy', 'Clock', 'Target'
];

const PortalSectionManager = () => {
  const [staffSections, setStaffSections] = useState<PortalSection[]>([]);
  const [studentSections, setStudentSections] = useState<PortalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<PortalSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    portal_type: 'staff' as 'staff' | 'student',
    section_key: '',
    title: '',
    description: '',
    icon: 'FileText',
    content_type: 'custom',
    is_visible: true,
    custom_content: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('portal_sections')
        .select('*')
        .order('portal_type', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      const staff = data?.filter(s => s.portal_type === 'staff').map(s => ({
        ...s,
        portal_type: s.portal_type as 'staff' | 'student'
      })) || [];
      const student = data?.filter(s => s.portal_type === 'student').map(s => ({
        ...s,
        portal_type: s.portal_type as 'staff' | 'student'
      })) || [];

      setStaffSections(staff);
      setStudentSections(student);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: "Error",
        description: "Failed to load portal sections.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = () => {
    setEditingSection(null);
    setFormData({
      portal_type: 'staff',
      section_key: '',
      title: '',
      description: '',
      icon: 'FileText',
      content_type: 'custom',
      is_visible: true,
      custom_content: {}
    });
    setIsDialogOpen(true);
  };

  const handleEditSection = (section: PortalSection) => {
    setEditingSection(section);
    setFormData({
      portal_type: section.portal_type,
      section_key: section.section_key,
      title: section.title,
      description: section.description || '',
      icon: section.icon,
      content_type: section.content_type,
      is_visible: section.is_visible,
      custom_content: section.custom_content || {}
    });
    setIsDialogOpen(true);
  };

  const handleSaveSection = async () => {
    try {
      const sectionData = {
        ...formData,
        order_index: editingSection?.order_index || 
          (formData.portal_type === 'staff' ? staffSections.length : studentSections.length)
      };

      if (editingSection) {
        const { error } = await supabase
          .from('portal_sections')
          .update(sectionData)
          .eq('id', editingSection.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portal_sections')
          .insert([sectionData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Section ${editingSection ? 'updated' : 'created'} successfully.`
      });

      setIsDialogOpen(false);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: "Failed to save section.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portal_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Section deleted successfully."
      });

      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section.",
        variant: "destructive"
      });
    }
  };

  const handleReorderSection = async (sectionId: string, direction: 'up' | 'down') => {
    const sections = formData.portal_type === 'staff' ? staffSections : studentSections;
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    try {
      const updates = [
        { id: sections[currentIndex].id, order_index: newIndex },
        { id: sections[newIndex].id, order_index: currentIndex }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('portal_sections')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (error) throw error;
      }

      fetchSections();
    } catch (error) {
      console.error('Error reordering sections:', error);
      toast({
        title: "Error",
        description: "Failed to reorder sections.",
        variant: "destructive"
      });
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const renderSectionList = (sections: PortalSection[], portalType: string) => (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={section.id} className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {renderIcon(section.icon)}
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{section.content_type}</Badge>
                    <Badge variant={section.is_visible ? "default" : "secondary"}>
                      {section.is_visible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReorderSection(section.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReorderSection(section.id, 'down')}
                  disabled={index === sections.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection(section)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portal Section Management</h2>
          <p className="text-muted-foreground">Manage sections for staff and student portals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </DialogTitle>
              <DialogDescription>
                Configure the section details and content type.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="portal_type">Portal Type</Label>
                <Select
                  value={formData.portal_type}
                  onValueChange={(value: 'staff' | 'student') => 
                    setFormData(prev => ({ ...prev, portal_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff Portal</SelectItem>
                    <SelectItem value="student">Student Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section_key">Section Key</Label>
                <Input
                  id="section_key"
                  value={formData.section_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_key: e.target.value }))}
                  placeholder="unique-section-key"
                />
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Section Title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Section description"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center space-x-2">
                          {renderIcon(icon)}
                          <span>{icon}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
                />
                <Label htmlFor="is_visible">Visible</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveSection} className="flex-1">
                  {editingSection ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList>
          <TabsTrigger value="staff">Staff Portal ({staffSections.length})</TabsTrigger>
          <TabsTrigger value="student">Student Portal ({studentSections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Portal Sections</CardTitle>
              <CardDescription>
                Manage sections available in the staff portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {staffSections.length > 0 ? (
                renderSectionList(staffSections, 'staff')
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sections configured for staff portal
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Student Portal Sections</CardTitle>
              <CardDescription>
                Manage sections available in the student portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentSections.length > 0 ? (
                renderSectionList(studentSections, 'student')
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sections configured for student portal
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalSectionManager;