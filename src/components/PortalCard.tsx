import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "primary" | "secondary" | "accent" | "navy";
}

const PortalCard = ({ title, description, icon: Icon, path, color }: PortalCardProps) => {
  const colorClasses = {
    primary: "from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
    secondary: "from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary", 
    accent: "from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground",
    navy: "from-navy to-navy/80 hover:from-navy/90 hover:to-navy"
  };

  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      <CardHeader className={`bg-gradient-to-br ${colorClasses[color]} text-white`}>
        <div className="flex items-center space-x-3">
          <Icon className="h-8 w-8" />
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <CardDescription className="text-white/90">Access your portal</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link to={path}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Access Portal
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PortalCard;