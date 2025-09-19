import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Clock, Users, Wifi, Computer, Book, Newspaper } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import libraryInterior from "@/assets/library-interior.jpg";

const Library = () => {
  const facilities = [
    {
      icon: Book,
      title: "Extensive Collection",
      description: "Over 5,000 books covering curriculum subjects and general knowledge"
    },
    {
      icon: Computer,
      title: "Digital Resources",
      description: "Computer terminals with internet access for research"
    },
    {
      icon: Wifi,
      title: "Free WiFi",
      description: "Complimentary internet access for all library users"
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Designated areas for collaborative learning"
    },
    {
      icon: Newspaper,
      title: "Periodicals",
      description: "Current newspapers, magazines, and academic journals"
    },
    {
      icon: Clock,
      title: "Extended Hours",
      description: "Open during school hours and after classes"
    }
  ];

  const subjects = [
    { category: "JSS Subjects", subjects: [
      "English", "Mathematics", "Basic Science and Technology", "National Value Education",
      "Pre-Vocational Studies", "Business Studies", "Cultural And Creative Arts", "Yoruba",
      "Christian Religious Studies", "Computer Studies", "History"
    ]},
    { category: "SSS Subjects", subjects: [
      "English Language", "Mathematics", "Civic Education", "Trade Subject (Bookkeeping)",
      "Physics", "Chemistry", "Biology", "Agric Science", "Further Mathematics", 
      "Economics", "Government", "CRS", "Literature in English", "Yoruba", 
      "Commerce", "Office Practice", "Computer", "Financial Accounting"
    ]}
  ];

  const libraryRules = [
    "Maintain absolute silence in reading areas",
    "Handle books and materials with care",
    "Return borrowed books on time",
    "No food or drinks in the library",
    "Keep personal belongings secure",
    "Respect other library users"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Our God Reigns Crystal School" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Library</h1>
          <p className="text-xl mb-2">Gateway to Knowledge</p>
          <p className="text-lg opacity-90">Fostering Academic Excellence Through Research and Reading</p>
        </div>
      </section>

      {/* Library Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Our Library</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our state-of-the-art library serves as the intellectual heart of Our God Reigns Crystal School, 
                  providing students and staff with access to a vast collection of books, digital resources, 
                  and comfortable study spaces designed to enhance learning and research.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={libraryInterior} 
                  alt="Modern Library Interior"
                  className="rounded-lg shadow-elegant max-w-lg w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <Card key={index} className="text-center group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <CardTitle className="text-primary">{facility.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{facility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Subject Resources */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Subject Resources</h2>
            <p className="text-lg text-muted-foreground">Comprehensive resources for all curriculum subjects</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {subjects.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {section.category}
                  </CardTitle>
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

      {/* Library Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Library Services</h2>
            <p className="text-lg text-muted-foreground">Comprehensive support for your academic journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Search className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Research Assistance</h3>
                <p className="text-sm text-muted-foreground">Guidance for academic research and projects</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <BookOpen className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Book Borrowing</h3>
                <p className="text-sm text-muted-foreground">Borrow books for extended study periods</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Computer className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Digital Access</h3>
                <p className="text-sm text-muted-foreground">Online databases and e-learning resources</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-navy group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Study Spaces</h3>
                <p className="text-sm text-muted-foreground">Quiet individual and group study areas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Library Rules and Hours */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Library Rules
                </CardTitle>
                <CardDescription>Guidelines for a conducive learning environment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {libraryRules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Operating Hours
                </CardTitle>
                <CardDescription>When you can access library services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-primary mb-2">School Days</h4>
                  <p className="text-muted-foreground">7:30 AM - 4:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-2">Break Periods</h4>
                  <p className="text-muted-foreground">10:30 AM - 11:00 AM<br />1:00 PM - 2:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2">After School</h4>
                  <p className="text-muted-foreground">4:00 PM - 5:30 PM<br />(Study sessions)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Visit Our Library Today</h2>
          <p className="text-lg text-muted-foreground mb-8">Discover the joy of learning in our modern library facility</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Library Membership
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Book Catalog
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Library;