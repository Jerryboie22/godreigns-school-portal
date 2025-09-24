import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface ParentFormProps {
  parent?: any;
  onSave: (parentData: any) => void;
  onCancel: () => void;
}

interface ParentData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  relationship: string;
  emergency_contact: boolean;
  profile_id?: string;
}

export const ParentForm: React.FC<ParentFormProps> = ({ parent, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ParentData>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    relationship: '',
    emergency_contact: false
  });

  useEffect(() => {
    if (parent) {
      setFormData({
        full_name: parent.full_name || '',
        email: parent.email || '',
        phone: parent.phone || '',
        address: parent.address || '',
        occupation: parent.occupation || '',
        relationship: parent.relationship || '',
        emergency_contact: parent.emergency_contact || false,
        profile_id: parent.profile_id
      });
    }
  }, [parent]);

  const handleInputChange = (field: keyof ParentData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.full_name || !formData.relationship) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name and Relationship).",
          variant: "destructive"
        });
        return;
      }

      if (parent) {
        // Update existing parent
        // Note: Parents table not yet available, will be updated when migration succeeds
        toast({
          title: "Feature Coming Soon",
          description: "Parent management will be available once database setup is complete.",
          variant: "default"
        });
        onSave(formData);
        return;

      } else {
        // Create new parent
        // Note: Parents table not yet available, will be updated when migration succeeds
        toast({
          title: "Feature Coming Soon", 
          description: "Parent management will be available once database setup is complete.",
          variant: "default"
        });
        onSave(formData);
        return;
      }

      toast({
        title: "Success",
        description: `Parent ${parent ? 'updated' : 'created'} successfully.`
      });

      onSave(formData);
    } catch (error: any) {
      console.error('Error saving parent:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${parent ? 'update' : 'create'} parent.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">
          {parent ? 'Edit Parent/Guardian' : 'Add New Parent/Guardian'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter parent/guardian's full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="parent@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Student *</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => handleInputChange('relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Parent's occupation"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Home address"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency_contact"
                checked={formData.emergency_contact}
                onCheckedChange={(checked) => handleInputChange('emergency_contact', !!checked)}
              />
              <Label htmlFor="emergency_contact" className="text-sm">
                Primary Emergency Contact
              </Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (parent ? 'Update Parent' : 'Add Parent')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};