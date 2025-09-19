import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, X, Star, Award } from "lucide-react";
import awardWinner from "@/assets/award-winner-emmanuella.jpg";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Excellence Achieved!", 
  message = "Congratulations to Miss Adeyemo Emmanuella Adedamola on being awarded the Best Female Senior School Certificate Examination (SSCE) candidate in Nigeria for 2024! This remarkable achievement showcases the quality of education and dedication at Our God Reigns Crystal School." 
}: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] mx-auto">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center space-y-4">
            <div className="mx-auto bg-gradient-primary rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-primary flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-accent animate-pulse" />
              {title}
              <Star className="h-5 w-5 text-accent animate-pulse" />
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Award Winner Image */}
          <div className="flex justify-center mb-4">
            <img 
              src={awardWinner}
              alt="Miss Adeyemo Emmanuella Adedamola - NECO Excellence Award Winner"
              className="w-48 h-48 object-cover rounded-lg shadow-elegant border-4 border-primary/20"
            />
          </div>
          
          <p className="text-muted-foreground leading-relaxed">{message}</p>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">Academic Session 2025/2026</span>
            </div>
            <p className="text-sm text-muted-foreground">
              "Light to the World" - Our God Reigns Crystal School
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300">
            Continue Excellence Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;