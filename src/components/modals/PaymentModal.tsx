import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, DollarSign } from "lucide-react";

interface PaymentModalProps {
  childId: string;
  onPaymentCompleted: () => void;
}

const PaymentModal = ({ childId, onPaymentCompleted }: PaymentModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    fee_type: "",
    payment_method: "card"
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Simulate payment processing
      const transactionId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { error } = await supabase
        .from('fee_payments')
        .insert({
          student_id: childId,
          parent_id: user.id,
          amount: parseFloat(formData.amount),
          fee_type: formData.fee_type,
          payment_method: formData.payment_method,
          status: 'completed',
          transaction_id: transactionId,
          payment_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: `Payment of ₦${formData.amount} has been processed successfully.`,
      });

      setFormData({
        amount: "",
        fee_type: "",
        payment_method: "card"
      });
      setOpen(false);
      onPaymentCompleted();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
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
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Fees
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            Pay School Fees
          </DialogTitle>
          <DialogDescription>
            Make a secure payment for school fees.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fee_type">Fee Type</Label>
            <Select
              value={formData.fee_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fee_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tuition">Tuition Fees</SelectItem>
                <SelectItem value="Development">Development Levy</SelectItem>
                <SelectItem value="Examination">Examination Fees</SelectItem>
                <SelectItem value="Library">Library Fees</SelectItem>
                <SelectItem value="Sports">Sports Levy</SelectItem>
                <SelectItem value="Transport">Transport Fees</SelectItem>
                <SelectItem value="Uniform">Uniform Fees</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Payment Summary</h4>
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span>₦{formData.amount || "0.00"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Processing Fee:</span>
              <span>₦0.00</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>₦{formData.amount || "0.00"}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.amount || !formData.fee_type}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;