import { useState, useEffect } from "react";
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
  title = "NECO EXCELLENCE CHAMPION!", 
  message = "Adeyemo Emmanuella Adedamola from OGRCS won the Overall Best SSCE Candidate in Nigeria award at the Learn Africa Education Development Foundation NECO-Excellence Awards 2024/2025." 
}: SuccessModalProps) => {
  const [visitTime, setVisitTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setVisitTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] mx-auto bg-white">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="text-center space-y-4">
            <div className="mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-2xl">🎉</span>
                <span className="text-lg font-bold text-emerald-700">{title}</span>
                <span className="text-2xl">🎉</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl">🎊</span>
                <span className="text-xl">🎊</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {/* Visit Timer */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              Time on site: <span className="font-bold">{visitTime}s</span>
            </p>
          </div>

          {/* Award Winner Image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={awardWinner}
                alt="Miss Adeyemo Emmanuella Adedamola - NECO Excellence Award Winner"
                className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-yellow-400"
              />
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Trophy className="h-4 w-4 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* Winner Text */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-yellow-600">₦1,000,000 Winner!</h3>
          </div>
          
          <div className="text-left space-y-3 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium italic">
              "This outstanding achievement demonstrates our commitment to academic excellence and our school motto: 'Light to the World'"
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-medium">
              View Gallery
            </Button>
            <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 font-medium">
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;