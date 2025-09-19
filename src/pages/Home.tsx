import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalCard from "@/components/PortalCard";
import SuccessModal from "@/components/SuccessModal";
import { ChevronLeft, ChevronRight, Users, Award, BookOpen, Shield, Heart, Target, Eye, Calendar, ArrowRight, Phone, Mail, MapPin, Clock, CreditCard } from "lucide-react";

import logo from "@/assets/logo.jpeg";
import proprietress from "@/assets/proprietress.jpg";
import chairman from "@/assets/chairman.jpg";
import principal from "@/assets/principal.jpg";
import vicePrincipal from "@/assets/vice-principal.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import achievement from "@/assets/achievement.jpg";
import awardCeremony from "@/assets/award-ceremony.jpg";
import culturalDance from "@/assets/cultural-dance.jpg";
import studentsGroup from "@/assets/students-group.jpg";
import achievementStudents from "@/assets/achievement-students.jpg";
import necoAwards from "@/assets/neco-awards.jpg";
import necoExcellence from "@/assets/neco-excellence.jpg";
import studentGroupBlue from "@/assets/student-group-blue.jpg";
import studentsPurple from "@/assets/students-purple-uniforms.jpg";
import awardWinner from "@/assets/award-winner-emmanuella.jpg";
import necoExcellenceAwards from "@/assets/neco-excellence-awards.jpg";
import millionNaira from "@/assets/million-naira-cheque.jpg";
import certificatePresentation from "@/assets/certificate-presentation.jpg";
import awardCeremonyOfficials from "@/assets/award-ceremony-officials.jpg";
import awardCeremonyPresentation from "@/assets/award-ceremony-presentation.jpg";
import officialAwardCeremony from "@/assets/official-award-ceremony.jpg";

const Home = () => {
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const galleryImages = [
    gallery1, 
    gallery2, 
    gallery3, 
    achievement, 
    awardCeremony,
    culturalDance,
    studentsGroup,
    achievementStudents,
    necoAwards,
    necoExcellence,
    studentGroupBlue,
    studentsPurple,
    awardWinner,
    necoExcellenceAwards,
    millionNaira,
    certificatePresentation,
    awardCeremonyOfficials,
    awardCeremonyPresentation,
    officialAwardCeremony
  ];

  const nextImage = () => {
    setCurrentGalleryImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentGalleryImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const blogPosts = [
    {
      id: 1,
      title: "NECO Excellence Awards 2025/2026: Our Students Shine",
      excerpt: "Celebrating our students' outstanding achievements at the NECO Excellence Awards for the 2025/2026 academic session. Emmanuella receives special recognition for academic excellence...",
      date: "2025-09-15",
      category: "Awards",
      image: awardWinner
    },
    {
      id: 2,
      title: "Million Naira Achievement Fund Launch", 
      excerpt: "Our God Reigns Crystal School launches the Million Naira Achievement Fund to support exceptional students and academic programs for the 2025/2026 session...",
      date: "2025-09-12",
      category: "News",
      image: millionNaira
    },
    {
      id: 3,
      title: "Cultural Heritage Celebration 2025",
      excerpt: "Our students showcase their rich cultural heritage through dance, drama, and artistic expressions during our annual cultural week celebration...",
      date: "2025-09-10",
      category: "Campus Life", 
      image: culturalDance
    },
    {
      id: 4,
      title: "Certificate Presentation Ceremony",
      excerpt: "Annual certificate presentation ceremony recognizing academic achievements and character development of our graduating students...",
      date: "2025-09-08",
      category: "Academics",
      image: certificatePresentation
    },
    {
      id: 5,
      title: "New Student Orientation 2025/2026",
      excerpt: "Welcome to Academic Session 2025/2026! Our new students begin their journey of academic excellence and character building...",
      date: "2025-09-05",
      category: "Academics",
      image: studentsGroup
    },
    {
      id: 6,
      title: "Award Ceremony Officials Visit",
      excerpt: "Distinguished officials visit our school for the annual award ceremony, recognizing outstanding academic performance and moral excellence...",
      date: "2025-09-03",
      category: "Awards",
      image: awardCeremonyOfficials
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
            <p className="text-xl md:text-2xl mb-2 text-accent font-semibold">Light to the World</p>
            <p className="text-lg mb-2 opacity-90">A place for academic and moral excellence</p>
            <p className="text-sm mb-8 opacity-75">Academic Session 2025/2026 - Admission in Progress</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admissions">
                <Button size="lg" className="text-lg px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  Apply Now - 2025/2026
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

      {/* About Our School */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">About Our God Reigns Crystal School</h2>
              <p className="text-xl text-muted-foreground">A place for academic and moral excellence - Light to the World</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-accent/20 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">Admission in Progress</h3>
                  <p className="text-lg text-primary">into JSS & SSS Classes</p>
                  <p className="text-sm text-muted-foreground mt-2">Academic Session 2025/2026</p>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Our God Reigns Crystal School stands as a beacon of excellence in education, dedicated to nurturing young minds 
                  with both academic knowledge and moral values. We provide a comprehensive learning environment where students 
                  develop critical thinking skills, character, and leadership qualities that will serve them throughout their lives.
                </p>
                <Link to="/about">
                  <Button className="text-lg px-6">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <img 
                  src={achievement} 
                  alt="Our God Reigns Crystal School Students"
                  className="rounded-lg shadow-elegant w-full max-w-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Eye className="h-6 w-6 text-primary" />
                    <CardTitle className="text-primary">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To provide qualitative and affordable education. To raise God fearing leaders.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="h-6 w-6 text-accent" />
                    <CardTitle className="text-primary">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To maintain high standard at all times. To always ensure that our services are not overpriced. 
                    To nurture our students in the way of the Lord. To mentor our students to occupy leadership positions.
                  </p>
                </CardContent>
              </Card>
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
                <h2 className="text-3xl font-bold text-primary mb-6">Proprietress Welcome Address - 2025/2026 Session</h2>
                <div className="prose prose-lg">
                  <p className="text-muted-foreground mb-4">
                    "Distinguished Parents, Guardians, Staff, and Beloved Students, It is with great joy and gratitude to God Almighty that I warmly and sincerely welcome you all to the first term of the 2025/2026 academic session."
                  </p>
                  <p className="text-muted-foreground mb-4">
                    "To our returning students, welcome back! We are delighted to see your bright faces again, and we trust you had a refreshing holiday. To our new students and parents joining our school family for the first time, we say a heartfelt welcome."
                  </p>
                  <p className="text-muted-foreground mb-4">
                    "You are now part of a nurturing community where excellence, discipline, and character-building remain our watchwords. The start of a new academic year is always a season of fresh opportunities."
                  </p>
                  {showFullAddress && (
                    <>
                      <p className="text-muted-foreground mb-4">
                        "It is a time to set new goals, embrace new challenges, and strive for greater achievements. In Our God Reigns Crystal School, we remain committed to providing a safe, stimulating, and supportive environment where every child can discover and develop their unique potential."
                      </p>
                      <p className="text-muted-foreground mb-4">
                        "To our dear teachers and staff, I commend your tireless dedication and commitment. Together, let us continue to inspire, mentor, and guide our students towards academic excellence and moral uprightness. To our parents and guardians, we deeply appreciate your trust and partnership."
                      </p>
                      <p className="text-muted-foreground mb-4">
                        "Your cooperation and support are invaluable as we work hand in hand to shape the future of our children. My admonition to our students this term is simple: be focused, be diligent, and be disciplined. Remember, success comes through hard work, respect, and consistency."
                      </p>
                      <p className="text-muted-foreground mb-6">
                        "On behalf of the school management, I wish us all a fruitful, productive, and successful academic session ahead. With God on our side, this year will be filled with testimonies of growth and achievement. Once again, welcome to the 2025/2026 academic session."
                      </p>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFullAddress(!showFullAddress)}
                    className="mb-6"
                  >
                    {showFullAddress ? "Read Less" : "Read More"}
                    <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${showFullAddress ? "rotate-90" : ""}`} />
                  </Button>
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

      {/* About Section with Flyer Design */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">About Our God Reigns Crystal School</h2>
            <p className="text-xl text-muted-foreground mb-8">A place for academic and moral excellence - Light to the World</p>
            <div className="bg-accent/20 rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Admission in Progress</h3>
              <p className="text-lg text-primary">into JSS & SSS Classes</p>
              <p className="text-sm text-muted-foreground mt-2">Academic Session 2025/2026</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle className="text-primary">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide qualitative and affordable education. To raise God fearing leaders.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="h-6 w-6 text-accent" />
                  <CardTitle className="text-primary">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To maintain high standard at all times. To always ensure that our services are not overpriced. 
                  To nurture our students in the way of the Lord. To mentor our students to occupy leadership positions.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
            <h2 className="text-3xl font-bold text-primary mb-4">Latest News & Events</h2>
            <p className="text-lg text-muted-foreground">Stay updated with school news and events</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
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
                  <div className="flex items-center justify-between">
                    <Link to={`/blog/${post.id}`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                    {post.id === 1 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowSuccessModal(true)}
                        className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        View Achievement
                      </Button>
                    )}
                  </div>
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="NECO Excellence Award Winner 2025!"
        message="Congratulations to Miss Adeyemo Emmanuella Adedamola on being awarded the Best Female Senior School Certificate Examination (SSCE) candidate in Nigeria for 2025! This remarkable achievement showcases the quality of education and dedication at Our God Reigns Crystal School during the 2025/2026 academic session."
      />
    </div>
  );
};

export default Home;