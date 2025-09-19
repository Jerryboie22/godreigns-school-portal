import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalCard from "@/components/PortalCard";
import { ChevronLeft, ChevronRight, Users, Award, BookOpen, Shield, Heart, Target, Eye, Calendar, ArrowRight } from "lucide-react";

import logo from "@/assets/logo.jpeg";
import proprietress from "@/assets/proprietress.jpg";
import chairman from "@/assets/chairman.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import achievement from "@/assets/achievement.jpg";
import awardCeremony from "@/assets/award-ceremony.jpg";

const Home = () => {
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const galleryImages = [gallery1, gallery2, gallery3, achievement, awardCeremony];

  const nextImage = () => {
    setCurrentGalleryImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentGalleryImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const blogPosts = [
    {
      id: 1,
      title: "Celebrating Excellence: NECO Awards 2024",
      excerpt: "Our students shine bright at the prestigious NECO Excellence Awards...",
      date: "2024-09-15",
      category: "Awards"
    },
    {
      id: 2,
      title: "New Academic Session Begins",
      excerpt: "Welcome to a new year of learning and growth. Registration is ongoing...",
      date: "2024-09-10", 
      category: "Academics"
    },
    {
      id: 3,
      title: "Campus Life: Building Character and Leadership",
      excerpt: "Discover how our students develop leadership skills through various activities...",
      date: "2024-09-05",
      category: "Campus Life"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <img src={logo} alt="Our God Reigns Crystal School" className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Our God Reigns Crystal School
            </h1>
            <p className="text-xl md:text-2xl mb-2 text-accent">Light to the World</p>
            <p className="text-lg mb-8 opacity-90">A place for academic and moral excellence</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admissions">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Apply Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 border-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proprietress Welcome Address */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Proprietress' Welcome Address</h2>
                <div className="prose prose-lg">
                  <p className="text-muted-foreground mb-4">
                    "Welcome to Our God Reigns Crystal School, where excellence meets purpose. As the Proprietress, 
                    I am committed to providing quality education that shapes not just brilliant minds, but 
                    character-driven individuals who will be lights in their communities."
                  </p>
                  <p className="text-muted-foreground mb-6">
                    "Our school stands as a beacon of hope, combining academic excellence with strong moral 
                    foundations rooted in Christian values. We believe every child is uniquely gifted, 
                    and we are here to nurture and develop those gifts to their fullest potential."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold text-primary">Pastor (Mrs) Kehinde Adetuberu</p>
                      <p className="text-sm text-muted-foreground">Proprietress</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={proprietress} 
                  alt="Pastor (Mrs) Kehinde Adetuberu - Proprietress"
                  className="rounded-lg shadow-elegant max-w-sm w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">About Our God Reigns Crystal School</h2>
            <p className="text-xl text-muted-foreground mb-8">A place for academic and moral excellence - Light to the World</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle className="text-primary">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be a leading educational institution that produces academically excellent and morally upright individuals 
                  who serve as beacons of light in their communities and the world at large.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="h-6 w-6 text-secondary" />
                  <CardTitle className="text-primary">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide quality education that combines academic excellence with strong Christian values, 
                  nurturing young minds to become responsible leaders and positive change agents in society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Academic Programs</h2>
            <p className="text-lg text-muted-foreground">Comprehensive education from foundation to senior secondary</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-6 group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <CardTitle className="text-primary">Nursery & Primary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strong foundation in basic learning skills with emphasis on character development and Christian values.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="mx-auto bg-secondary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <CardTitle className="text-primary">Junior Secondary (JSS)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive curriculum preparing students for senior secondary education with focus on critical thinking.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="mx-auto bg-accent/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Award className="h-8 w-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <CardTitle className="text-primary">Senior Secondary (SSS)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Excellence-focused program preparing students for WAEC, NECO, and university admission.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Portals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Access Your Portal</h2>
            <p className="text-lg text-muted-foreground">Dedicated portals for different user roles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <PortalCard
              title="Admin Portal"
              description="Comprehensive school management and administration"
              icon={Shield}
              path="/portal/admin"
              color="primary"
            />
            <PortalCard
              title="Staff Portal"
              description="Teacher resources, lesson plans, and student records"
              icon={Users}
              path="/portal/staff"
              color="secondary"
            />
            <PortalCard
              title="Parent Portal"
              description="Monitor your child's progress and school activities"
              icon={Heart}
              path="/portal/parent"
              color="accent"
            />
            <PortalCard
              title="Student Portal"
              description="Access assignments, grades, and school resources"
              icon={BookOpen}
              path="/portal/student"
              color="navy"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Our God Reigns Crystal School?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Academic Excellence</h3>
              <p className="text-muted-foreground">Consistent outstanding performance in WAEC and NECO examinations</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Qualified Teachers</h3>
              <p className="text-muted-foreground">Experienced and dedicated teaching staff committed to student success</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-accent/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Character Building</h3>
              <p className="text-muted-foreground">Strong emphasis on moral values and Christian principles</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-navy/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-primary">Modern Facilities</h3>
              <p className="text-muted-foreground">Well-equipped classrooms, laboratories, and learning resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life & Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Campus Life & Gallery</h2>
              <p className="text-lg text-muted-foreground">Experience the vibrant school community</p>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-elegant">
                <img 
                  src={galleryImages[currentGalleryImage]} 
                  alt="Campus Life" 
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-primary" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              >
                <ChevronRight className="h-6 w-6 text-primary" />
              </button>
              
              <div className="flex justify-center space-x-2 mt-4">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentGalleryImage ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/gallery">
                <Button variant="outline" size="lg">
                  View Full Gallery
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Latest Blog Posts</h2>
            <p className="text-lg text-muted-foreground">Stay updated with school news and events</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/blog">
              <Button variant="outline" size="lg">
                View All Posts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Management Team</h2>
            <p className="text-lg text-muted-foreground">Meet our dedicated leadership</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <img 
                  src={chairman} 
                  alt="Pastor Akinsanya Aderemi Adetuberu"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-primary mb-1">Pastor Akinsanya Aderemi Adetuberu (FCA)</h3>
                <p className="text-accent font-medium mb-2">Chairman</p>
                <p className="text-sm text-muted-foreground">Leading with vision and integrity</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <img 
                  src={proprietress} 
                  alt="Pastor (Mrs) Kehinde Adetuberu"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-primary mb-1">Pastor (Mrs) Kehinde Adetuberu</h3>
                <p className="text-accent font-medium mb-2">Proprietress</p>
                <p className="text-sm text-muted-foreground">Nurturing excellence in education</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-1">Pastor Joseph Oladele</h3>
                <p className="text-accent font-medium mb-2">Principal</p>
                <p className="text-sm text-muted-foreground">Academic leadership and guidance</p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-secondary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-1">Mrs Abosede Taiwo</h3>
                <p className="text-accent font-medium mb-2">Vice Principal</p>
                <p className="text-sm text-muted-foreground">Supporting academic excellence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;