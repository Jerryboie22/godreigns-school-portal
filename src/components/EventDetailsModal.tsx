import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  event: {
    event: string;
    date: string;
    time: string;
  } | null;
}

const EventDetailsModal = ({ open, onClose, event }: EventDetailsModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Event Details</span>
          </DialogTitle>
          <DialogDescription>
            Information about the upcoming school event
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{event.event}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">School Premises</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Badge variant="outline" className="mb-2">Upcoming Event</Badge>
            <p className="text-sm text-muted-foreground">
              Please mark your calendar for this important school event. More details will be shared closer to the date.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;