import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Wifi, Play, Download, Users, BookOpen, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const ELearning = () => {
  const features = [
    {
      icon: Monitor,
      title: "Digital Classrooms",
      description: "Interactive online learning environments for all subjects"
    },
    {
      icon: Video,
      title: "Video Lessons",
      description: "High-quality recorded lessons available 24/7"
    },
    {
      icon: FileText,
      title: "Digital Resources",
      description: "Comprehensive e-books, worksheets, and study materials"
    },
    {
      icon: Users,
      title: "Virtual Discussions",
      description: "Online forums for student collaboration and peer learning"
    },
    {
      icon: Download,
      title: "Offline Access",
      description: "Download materials for offline study and review"
    },
    {
      icon: Wifi,
      title: "Real-time Updates",
      description: "Instant notifications for assignments and announcements"
    }
  ];

  const subjects = [
    { category: "JSS E-Learning Modules", subjects: [
      "English", "Mathematics", "Basic Science and Technology", "National Value Education",
      "Pre-Vocational Studies", "Business Studies", "Cultural And Creative Arts", "Yoruba",
      "Christian Religious Studies", "Computer Studies", "History"
    ]},
    { category: "SSS E-Learning Modules", subjects: [
      "English Language", "Mathematics", "Civic Education", "Trade Subject (Bookkeeping)",
      "Physics", "Chemistry", "Biology", "Agric Science", "Further Mathematics", 
      "Economics", "Government", "CRS", "Literature in English", "Yoruba", 
      "Commerce", "Office Practice", "Computer", "Financial Accounting"
    ]}
  ];

  const benefits = [
    "Learn at your own pace and schedule",
    "Access to recorded lessons for revision",
    "Interactive quizzes and assessments",
    "Progress tracking and performance analytics",
    "Mobile-friendly platform for learning anywhere",
    "Direct communication with teachers online"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">E-Learning Platform</h1>
          <p className="text-xl mb-2">Digital Education Excellence</p>
          <p className="text-lg opacity-90">Learn Anywhere, Anytime with Our Advanced E-Learning System</p>
          <div className="mt-8">
            <Link to="/portal/student">
              <Button size="lg" variant="secondary" className="text-lg px-8 mr-4">
                Student Login
              </Button>
            </Link>
            <Link to="/portal/staff">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 border-white">
                Teacher Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground">Cutting-edge technology for modern education</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <CardTitle className="text-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Available Courses</h2>
            <p className="text-lg text-muted-foreground">Comprehensive digital curriculum for all levels</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {subjects.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {section.category}
                  </CardTitle>
                  <CardDescription>Interactive digital modules and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {section.subjects.map((subject, subIndex) => (
                      <Badge key={subIndex} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Our E-Learning?</h2>
              <p className="text-lg text-muted-foreground">Experience the future of education</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Tools */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Learning Tools</h2>
            <p className="text-lg text-muted-foreground">Advanced tools to enhance your learning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Video Lectures</h3>
                <p className="text-sm text-muted-foreground">HD quality recorded lessons</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <FileText className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Digital Worksheets</h3>
                <p className="text-sm text-muted-foreground">Interactive practice materials</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Monitor className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Virtual Labs</h3>
                <p className="text-sm text-muted-foreground">Online science experiments</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-navy group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Discussion Forums</h3>
                <p className="text-sm text-muted-foreground">Peer-to-peer learning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students already benefiting from our e-learning platform
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">Create Account</h3>
                <p className="text-sm text-muted-foreground">Register with your student ID</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">Choose Courses</h3>
                <p className="text-sm text-muted-foreground">Select your subjects and level</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">Start Learning</h3>
                <p className="text-sm text-muted-foreground">Begin your digital education journey</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/portal/student">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <a href="#learning-tools" onClick={(e) => {
                e.preventDefault();
                document.querySelector('#learning-tools')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Features
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ELearning;