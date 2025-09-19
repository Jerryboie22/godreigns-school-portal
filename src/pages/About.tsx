import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Target, Heart, Users, Award, BookOpen, Shield, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.jpeg";
import chairman from "@/assets/chairman.jpg";
import proprietress from "@/assets/proprietress.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Christian Values",
      description: "Building character on the foundation of Christian principles and moral excellence"
    },
    {
      icon: Award,
      title: "Academic Excellence",
      description: "Consistent outstanding performance in national examinations and competitions"
    },
    {
      icon: Users,
      title: "Holistic Development",
      description: "Nurturing intellectual, spiritual, social, and physical growth in every student"
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Upholding the highest standards of honesty, transparency, and ethical conduct"
    },
    {
      icon: BookOpen,
      title: "Innovation",
      description: "Embracing modern teaching methods and educational technologies"
    },
    {
      icon: GraduationCap,
      title: "Leadership",
      description: "Developing future leaders who will make positive impacts in society"
    }
  ];

  const leadership = [
    {
      name: "Pastor Akinsanya Aderemi Adetuberu (FCA)",
      position: "Chairman",
      image: chairman,
      description: "Leading with vision and integrity, Pastor Adetuberu brings decades of experience in education and spiritual leadership to guide the school's strategic direction."
    },
    {
      name: "Pastor (Mrs) Kehinde Adetuberu",
      position: "Proprietress",
      image: proprietress,
      description: "As the driving force behind Our God Reigns Crystal School, Pastor Mrs Adetuberu is passionate about providing quality education that transforms lives."
    },
    {
      name: "Pastor Joseph Oladele",
      position: "Principal",
      image: null,
      description: "With extensive experience in educational administration, Pastor Oladele ensures academic excellence while maintaining our core values."
    },
    {
      name: "Mrs Abosede Taiwo",
      position: "Vice Principal",
      image: null,
      description: "Supporting the academic vision and ensuring smooth daily operations for optimal learning experiences."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <img src={logo} alt="Our God Reigns Crystal School" className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">About Our School</h1>
            <p className="text-xl md:text-2xl text-accent">Light to the World</p>
            <p className="text-lg mt-4 opacity-90">A place for academic and moral excellence</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="p-8 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To be a leading educational institution that produces academically excellent and morally upright individuals 
                    who serve as beacons of light in their communities and the world at large, making positive impacts through 
                    their knowledge, character, and Christian values.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Target className="h-8 w-8 text-secondary" />
                    <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To provide quality education that combines academic excellence with strong Christian values, 
                    nurturing young minds to become responsible leaders and positive change agents in society 
                    while maintaining the highest standards of moral and intellectual development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <Card className="p-8">
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Our God Reigns Crystal School was established with a divine vision to create an institution 
                    where academic excellence meets moral development. Founded on the principles of Christian 
                    education, our school has grown to become a beacon of hope and excellence in the educational 
                    landscape of Ogun State and Nigeria.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Located at 23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State, 
                    our institution serves as a nurturing ground for young minds seeking both intellectual 
                    growth and character development. Our motto, "Light to the World," reflects our commitment 
                    to producing graduates who illuminate their communities with knowledge, wisdom, and Christian values.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Over the years, we have consistently maintained high academic standards while ensuring that 
                    our students develop strong moral foundations. Our success is evidenced by outstanding 
                    performances in national examinations, including WAEC and NECO, and the recognition 
                    our students receive in various academic competitions and awards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-4">Our Core Values</h2>
            <p className="text-lg text-center text-muted-foreground mb-12">
              The principles that guide everything we do
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <value.icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <CardTitle className="text-primary">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-4">Leadership Team</h2>
            <p className="text-lg text-center text-muted-foreground mb-12">
              Meet the dedicated leaders shaping our educational vision
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadership.map((leader, index) => (
                <Card key={index} className="overflow-hidden group hover:shadow-elegant transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      {leader.image ? (
                        <img 
                          src={leader.image} 
                          alt={leader.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Users className="h-16 w-16 text-primary opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{leader.name}</h3>
                      <p className="text-accent font-medium mb-4">{leader.position}</p>
                      <p className="text-muted-foreground">{leader.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Academic Excellence</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive education from nursery to senior secondary level
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">847</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Total Students</h3>
                <p className="text-muted-foreground">Across all levels</p>
              </div>
              
              <div className="text-center">
                <div className="bg-secondary/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">42</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Teaching Staff</h3>
                <p className="text-muted-foreground">Qualified educators</p>
              </div>
              
              <div className="text-center">
                <div className="bg-accent/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">98%</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Success Rate</h3>
                <p className="text-muted-foreground">WAEC & NECO</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admissions">
                <Button size="lg" className="text-lg px-8">
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;