import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Award,
  Clock,
  FileText,
  User,
  Phone,
  LogOut,
  Edit,
  Trash2,
  CreditCard
} from "lucide-react";
import AddChildModal from "@/components/modals/AddChildModal";
import PaymentModal from "@/components/modals/PaymentModal";
import ProfileEditModal from "@/components/modals/ProfileEditModal";
import NotificationsModal from "@/components/modals/NotificationsModal";

interface ChildRecord {
  id: string;
  child_name: string;
  class_level: string;
  admission_number?: string;
  current_gpa?: number;
  attendance_percentage: number;
  outstanding_fees: number;
}

const ParentPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [childrenRecords, setChildrenRecords] = useState<ChildRecord[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      setProfile(profileData);
      await fetchChildrenRecords(session.user.id);
      await fetchPayments(session.user.id);
      
      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history.",
        variant: "destructive",
      });
    }
  };

  const fetchChildrenRecords = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('children_records')
        .select('*')
        .eq('parent_id', userId);

      if (error) throw error;
      setChildrenRecords(data || []);
    } catch (error) {
      console.error('Error fetching children records:', error);
      toast({
        title: "Error",
        description: "Failed to load your children's records.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('children_records')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Record Removed",
        description: "Child record has been removed successfully.",
      });

      fetchChildrenRecords(user.id);
    } catch (error) {
      console.error('Error removing child record:', error);
      toast({
        title: "Error",
        description: "Failed to remove child record.",
        variant: "destructive",
      });
    }
  };

  const handlePayFees = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('children_records')
        .update({ outstanding_fees: 0 })
        .eq('id', childId);

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: "School fees have been paid successfully.",
      });

      fetchChildrenRecords(user.id);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getTotalOutstandingFees = () => {
    return childrenRecords.reduce((sum, child) => sum + child.outstanding_fees, 0);
  };

  const getAverageAttendance = () => {
    if (childrenRecords.length === 0) return 0;
    const total = childrenRecords.reduce((sum, child) => sum + child.attendance_percentage, 0);
    return Math.round(total / childrenRecords.length);
  };

  const getOverallGrade = () => {
    const validGPAs = childrenRecords.filter(child => child.current_gpa).map(child => child.current_gpa!);
    if (validGPAs.length === 0) return 'N/A';
    const average = validGPAs.reduce((sum, gpa) => sum + gpa, 0) / validGPAs.length;
    return average >= 3.5 ? 'A' : average >= 3.0 ? 'B+' : average >= 2.5 ? 'B' : 'C';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Parent Portal</h1>
                <p className="text-accent-foreground/90">Welcome back, {profile?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsModal userId={user?.id} />
              <Button onClick={handleLogout} variant="outline" className="text-white border-white hover:bg-white hover:text-accent">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Children</p>
                  <p className="text-2xl font-bold text-foreground">{childrenRecords.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{getAverageAttendance()}%</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Outstanding Fees</p>
                  <p className="text-2xl font-bold text-foreground">₦{getTotalOutstandingFees().toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Overall Grade</p>
                  <p className="text-2xl font-bold text-foreground">{getOverallGrade()}</p>
                </div>
                <Award className="h-8 w-8 text-navy" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="children">My Children</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Children Records</span>
                    </CardTitle>
                    <CardDescription>Overview of your children's academic records</CardDescription>
                  </div>
                  <AddChildModal onChildAdded={() => fetchChildrenRecords(user.id)} />
                </div>
              </CardHeader>
              <CardContent>
                {childrenRecords.length > 0 ? (
                  <div className="space-y-4">
                    {childrenRecords.map((child) => (
                      <div key={child.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{child.child_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Class: {child.class_level}
                              {child.admission_number && ` • Admission: ${child.admission_number}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {child.current_gpa && (
                              <Badge variant="secondary">GPA: {child.current_gpa}</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteChild(child.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Attendance:</span>
                            <span className="font-medium ml-2">{child.attendance_percentage}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Outstanding Fees:</span>
                            <span className="font-medium ml-2">₦{child.outstanding_fees.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No Children Records Found</p>
                    <p>Your children's records will appear here once they're added to the system.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Academic Performance</span>
                </CardTitle>
                <CardDescription>Your children's academic progress</CardDescription>
              </CardHeader>
              <CardContent>
                {childrenRecords.length > 0 ? (
                  <div className="space-y-4">
                    {childrenRecords.map((child) => (
                      <div key={child.id} className="p-4 rounded-lg border">
                        <h4 className="font-medium text-foreground mb-2">{child.child_name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Current GPA:</span>
                            <span className="font-medium">{child.current_gpa || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Class Position:</span>
                            <span className="font-medium">-</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No academic records available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span>Fee Management</span>
                </CardTitle>
                <CardDescription>School fees and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                {childrenRecords.length > 0 ? (
                  <div className="space-y-4">
                    {childrenRecords.map((child) => (
                      <div key={child.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{child.child_name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={child.outstanding_fees > 0 ? 'destructive' : 'default'}>
                              {child.outstanding_fees > 0 ? 'Outstanding' : 'Paid'}
                            </Badge>
                            {child.outstanding_fees > 0 && (
                              <PaymentModal 
                                childId={child.id} 
                                onPaymentCompleted={() => {
                                  fetchChildrenRecords(user.id);
                                  fetchPayments(user.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Outstanding Amount:</span>
                          <span className="font-medium">₦{child.outstanding_fees.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Outstanding:</span>
                        <span className="text-lg font-bold">₦{getTotalOutstandingFees().toLocaleString()}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          const childrenWithFees = childrenRecords.filter(child => child.outstanding_fees > 0);
                          if (childrenWithFees.length > 0) {
                            Promise.all(childrenWithFees.map(child => handlePayFees(child.id)));
                          }
                        }}
                        disabled={getTotalOutstandingFees() === 0}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay All Outstanding Fees
                      </Button>
                    </div>
                    
                    {/* Payment History */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Payment History</h3>
                      {payments.length > 0 ? (
                        <div className="space-y-3">
                          {payments.slice(0, 5).map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">{payment.fee_type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(payment.payment_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">₦{payment.amount.toLocaleString()}</p>
                                <Badge variant="default" className="text-xs">
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No payment history found.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fee records available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Parent Profile</span>
                    </CardTitle>
                    <CardDescription>Your profile information</CardDescription>
                  </div>
                  <ProfileEditModal 
                    currentProfile={profile} 
                    onProfileUpdated={() => checkAuth()} 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{profile?.email || user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="font-medium capitalize">{profile?.role || 'Parent'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Children</label>
                    <div className="space-y-1 mt-1">
                      {childrenRecords.map(child => (
                        <div key={child.id} className="text-sm">
                          <span className="font-medium">{child.child_name}</span>
                          <span className="text-muted-foreground ml-2">({child.class_level})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentPortal;