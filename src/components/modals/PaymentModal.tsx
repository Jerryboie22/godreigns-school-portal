import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Building2, Smartphone } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeAmount?: number;
  feeType?: string;
  studentId?: string;
  onPaymentComplete: () => void;
}

export const PaymentModal = ({ isOpen, onClose, feeAmount = 0, feeType = "School Fees", studentId = "", onPaymentComplete }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amount, setAmount] = useState(feeAmount.toString());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Not authenticated");
      }

      // Simulate payment processing (in real app, integrate with payment gateway)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Record payment in database
      const { error } = await supabase
        .from('fee_payments')
        .insert({
          parent_id: userData.user.id,
          student_id: studentId || 'unknown',
          fee_type: feeType,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          status: 'completed',
          transaction_id: `TXN_${Date.now()}`,
          payment_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: `₦${amount} has been paid successfully for ${feeType}`,
      });

      onPaymentComplete();
      onClose();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "card", label: "Debit/Credit Card", icon: CreditCard },
    { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
    { value: "mobile_money", label: "Mobile Money", icon: Smartphone }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Pay your school fees securely online.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feeType">Fee Type</Label>
            <Input
              id="feeType"
              value={feeType}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Icon className="h-4 w-4" />
                    <Label htmlFor={method.value} className="flex-1 cursor-pointer">
                      {method.label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Card Holder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Transfer to the following account and upload your receipt:
              </p>
              <div className="text-sm">
                <p><strong>Bank:</strong> First Bank of Nigeria</p>
                <p><strong>Account Name:</strong> Ogbomoso Grammar School</p>
                <p><strong>Account Number:</strong> 1234567890</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : `Pay ₦${amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};