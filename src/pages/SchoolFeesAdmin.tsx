import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const SchoolFeesAdmin = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newFee, setNewFee] = useState({
    student_id: '',
    amount: '',
    description: '',
    due_date: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: feesData } = await supabase
        .from('fees')
        .select(`
          *,
          students (
            student_id,
            profiles (full_name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (feesData) setFees(feesData);

      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          id,
          student_id,
          class,
          profiles (full_name)
        `)
        .order('student_id');
      
      if (studentsData) setStudents(studentsData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch school fees data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async () => {
    if (!newFee.student_id || !newFee.amount || !newFee.description || !newFee.due_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('fees').insert([{
        student_id: newFee.student_id,
        student_name: students.find(s => s.id === newFee.student_id)?.profiles?.full_name || 'Unknown Student',
        class_level: students.find(s => s.id === newFee.student_id)?.class_level || 'N/A',
        fee_type: newFee.description || 'School Fees',
        amount: parseFloat(newFee.amount),
        due_date: newFee.due_date,
        status: newFee.status
      }]);

      if (error) throw error;

      await fetchData();
      setNewFee({
        student_id: '',
        amount: '',
        description: '',
        due_date: '',
        status: 'pending'
      });

      toast({
        title: "Success",
        description: "School fee record created successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fees')
        .update({ 
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Fee marked as paid"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteFee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee record?')) return;

    try {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Fee record deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading school fees data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">School Fees Management</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Create New Fee */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add School Fee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Student</label>
                <Select value={newFee.student_id} onValueChange={(value) => setNewFee({...newFee, student_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.profiles?.full_name || 'Unknown'} ({student.student_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (₦)</label>
                <Input 
                  type="number"
                  placeholder="Amount..."
                  value={newFee.amount}
                  onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input 
                  placeholder="School fees description..."
                  value={newFee.description}
                  onChange={(e) => setNewFee({...newFee, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Input 
                  type="date"
                  value={newFee.due_date}
                  onChange={(e) => setNewFee({...newFee, due_date: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={handleCreateFee}
                className="w-full bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Record
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fee Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Records:</span>
                  <Badge>{fees.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Paid:</span>
                  <Badge variant="default">{fees.filter(f => f.status === 'paid').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending:</span>
                  <Badge variant="secondary">{fees.filter(f => f.status === 'pending').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overdue:</span>
                  <Badge variant="destructive">
                    {fees.filter(f => f.status === 'pending' && new Date(f.due_date) < new Date()).length}
                  </Badge>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg">
                      ₦{fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fees List */}
        <Card>
          <CardHeader>
            <CardTitle>All Fee Records ({fees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.map(fee => (
                <div key={fee.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {fee.students?.profiles?.full_name || 'Unknown Student'}
                        </h3>
                        <Badge variant="outline">{fee.students?.student_id}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{fee.description}</p>
                      <p className="font-semibold text-lg mb-2">₦{parseFloat(fee.amount).toLocaleString()}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Due: {new Date(fee.due_date).toLocaleDateString()}</span>
                        {fee.paid_date && (
                          <span>Paid: {new Date(fee.paid_date).toLocaleDateString()}</span>
                        )}
                        <Badge variant={
                          fee.status === 'paid' ? 'default' : 
                          new Date(fee.due_date) < new Date() ? 'destructive' : 'secondary'
                        }>
                          {fee.status === 'paid' ? 'Paid' : 
                           new Date(fee.due_date) < new Date() ? 'Overdue' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {fee.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkPaid(fee.id)}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteFee(fee.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {fees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fee records yet. Add the first one!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolFeesAdmin;