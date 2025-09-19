import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const Portals = () => {
  const portals = [
    {
      title: "Admin Portal",
      description: "Comprehensive school management, student records, staff management, and system administration",
      icon: Shield,
      path: "/portal/admin",
      color: "primary",
      features: [
        "Complete school management system",
        "Student and staff records management", 
        "Financial reports and analytics",
        "System configuration and settings",
        "Content management system",
        "Academic calendar management"
      ]
    },
    {
      title: "Staff Portal", 
      description: "Teacher resources, lesson plans, student management, and academic tools",
      icon: Users,
      path: "/portal/staff",
      color: "secondary",
      features: [
        "Student grade management",
        "Lesson plan creation and sharing",
        "Attendance tracking",
        "Assignment and assessment tools",
        "Parent communication system",
        "Professional development resources"
      ]
    },
    {
      title: "Parent Portal",
      description: "Monitor your child's progress, communicate with teachers, and stay updated",
      icon: Heart,
      path: "/portal/parent",
      color: "accent",
      features: [
        "Child's academic progress tracking",
        "Real-time attendance monitoring",
        "Teacher communication platform",
        "School fee payment system",
        "Event and announcement updates",
        "Report card access"
      ]
    },
    {
      title: "Student Portal",
      description: "Access assignments, grades, resources, and connect with classmates",
      icon: BookOpen,
      path: "/portal/student", 
      color: "navy",
      features: [
        "Assignment submission system",
        "Grade and performance tracking",
        "Digital library access",
        "E-learning platform integration",
        "Class schedule and timetable",
        "Peer collaboration tools"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          hoverBg: 'group-hover:bg-primary',
          text: 'text-primary',
          hoverText: 'group-hover:text-white',
          button: 'bg-primary hover:bg-primary/90'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          hoverBg: 'group-hover:bg-secondary',
          text: 'text-secondary',
          hoverText: 'group-hover:text-white',
          button: 'bg-secondary hover:bg-secondary/90'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          hoverBg: 'group-hover:bg-accent',
          text: 'text-accent',
          hoverText: 'group-hover:text-accent-foreground',
          button: 'bg-accent hover:bg-accent/90 text-accent-foreground'
        };
      case 'navy':
        return {
          bg: 'bg-navy/10',
          hoverBg: 'group-hover:bg-navy',
          text: 'text-navy',
          hoverText: 'group-hover:text-white',
          button: 'bg-navy hover:bg-navy/90'
        };
      default:
        return {
          bg: 'bg-primary/10',
          hoverBg: 'group-hover:bg-primary',
          text: 'text-primary',
          hoverText: 'group-hover:text-white',
          button: 'bg-primary hover:bg-primary/90'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">School Portals</h1>
          <p className="text-xl mb-2">Access Your Dedicated Dashboard</p>
          <p className="text-lg opacity-90">Streamlined access for administrators, staff, parents, and students</p>
        </div>
      </section>

      {/* Portal Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Choose Your Portal</h2>
            <p className="text-lg text-muted-foreground">Select the portal that matches your role in our school community</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {portals.map((portal, index) => {
              const Icon = portal.icon;
              const colors = getColorClasses(portal.color);
              
              return (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`${colors.bg} ${colors.hoverBg} rounded-full p-4 w-16 h-16 flex items-center justify-center transition-colors`}>
                        <Icon className={`h-8 w-8 ${colors.text} ${colors.hoverText} transition-colors`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-primary group-hover:text-primary">{portal.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{portal.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {portal.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <div className={`w-2 h-2 ${colors.bg.replace('/10', '')} rounded-full mt-2`}></div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4">
                      <Link to={portal.path}>
                        <Button className={`w-full ${colors.button} text-white`}>
                          Access {portal.title}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Portal Benefits</h2>
            <p className="text-lg text-muted-foreground">Why our digital portal system enhances your school experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Secure Access</h3>
              <p className="text-muted-foreground">Role-based authentication ensures data security and privacy</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Real-time Updates</h3>
              <p className="text-muted-foreground">Get instant notifications and updates on important school matters</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-accent/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Easy Communication</h3>
              <p className="text-muted-foreground">Seamless communication between all school stakeholders</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-navy/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-primary">24/7 Access</h3>
              <p className="text-muted-foreground">Access your portal anytime, anywhere with internet connectivity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Getting Started</h2>
            <p className="text-lg text-muted-foreground mb-8">
              New to our portal system? Here's how to get started with your account
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">Get Your Credentials</h3>
                <p className="text-sm text-muted-foreground">Contact the school office to receive your login credentials</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">First Login</h3>
                <p className="text-sm text-muted-foreground">Log in with your credentials and set up your profile</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">Explore Features</h3>
                <p className="text-sm text-muted-foreground">Discover all the features available in your portal</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Request Access
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portals;