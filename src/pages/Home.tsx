import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalCard from "@/components/PortalCard";
import SuccessModal from "@/components/SuccessModal";
import { ChevronLeft, ChevronRight, Users, Award, BookOpen, Shield, Heart, Target, Eye, Calendar, ArrowRight, Phone, Mail, MapPin, Clock, CreditCard, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import logo from "@/assets/logo.jpeg";
import proprietress from "@/assets/proprietress.jpg";
import chairman from "@/assets/chairman.jpg";
import principal from "@/assets/principal.jpg";
import vicePrincipal from "@/assets/vice-principal.jpg";
import schoolFlyer from "@/assets/school-flyer.jpg";
import graduateIndividual from "@/assets/graduate-individual.jpg";
import studentsGroup from "@/assets/students-group.jpg";

// Fallback images for gallery if database is empty
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import achievement from "@/assets/achievement.jpg";
import awardCeremony from "@/assets/award-ceremony.jpg";
import culturalDance from "@/assets/cultural-dance.jpg";

const Home = () => {
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback images if database is empty
  const fallbackGalleryImages = [
    gallery1, gallery2, gallery3, achievement, awardCeremony, culturalDance
  ];

  useEffect(() => {
    fetchDynamicContent();
    
    // Set up real-time subscriptions
    const postsChannel = supabase
      .channel('homepage-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchBlogPosts();
        }
      )
      .subscribe();

    const galleryChannel = supabase
      .channel('homepage-gallery-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_images'
        },
        () => {
          fetchGalleryImages();
        }
      )
      .subscribe();

    const contentChannel = supabase
      .channel('homepage-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_content'
        },
        () => {
          fetchHomepageContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(galleryChannel);
      supabase.removeChannel(contentChannel);
    };
  }, []);

  const fetchDynamicContent = async () => {
    setLoading(true);
    await Promise.all([fetchBlogPosts(), fetchGalleryImages(), fetchHomepageContent()]);
    setLoading(false);
  };

  const fetchHomepageContent = async () => {
    try {
      const { data } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_visible', true)
        .order('order_index', { ascending: true });

      if (data) {
        setHomepageContent(data);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 120) + '...',
          date: new Date(post.created_at).toISOString().split('T')[0],
          category: post.category || 'News',
          image: post.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E"
        }));
        setBlogPosts(formattedPosts);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('image_url')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (data && data.length > 0) {
        const imageUrls = data.map(img => img.image_url);
        setGalleryImages([...imageUrls, ...fallbackGalleryImages]);
      } else {
        setGalleryImages(fallbackGalleryImages);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setGalleryImages(fallbackGalleryImages);
    }
  };

  const nextImage = () => {
    setCurrentGalleryImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentGalleryImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage Not Available%3C/text%3E%3C/svg%3E";
  };

  return (
    <div className="min-h-screen bg-background">


      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-glow to-accent min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                    Admission Open for 2025/2026 Session
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="block text-white">Our God Reigns</span>
                    <span className="block text-yellow-300">Crystal School</span>
                  </h1>
                  
                  <div className="space-y-3">
                    <p className="text-2xl font-medium text-white/95">Light to the World</p>
                    <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                      Where academic excellence meets Christian values. Nurturing tomorrow's leaders with integrity, knowledge, and divine purpose.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-6 w-6 text-yellow-300" />
                        <div>
                          <p className="font-semibold text-white">JSS & SSS</p>
                          <p className="text-sm text-white/80">Available Classes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <Award className="h-6 w-6 text-yellow-300" />
                        <div>
                          <p className="font-semibold text-white">Excellence</p>
                          <p className="text-sm text-white/80">Academic Record</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/admissions">
                      <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-primary font-semibold px-8 py-4 text-lg shadow-elegant">
                        Apply for Admission
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/20">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center space-x-2 justify-center sm:justify-start">
                      <Phone className="h-4 w-4 text-yellow-300" />
                      <div className="text-sm">
                        <a href="tel:+2348027625129" className="hover:text-yellow-300 transition-colors">08027625129</a>
                        <span className="mx-1">•</span>
                        <a href="tel:+2348033089735" className="hover:text-yellow-300 transition-colors">08033089735</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <div className="flex items-center space-x-2 justify-center sm:justify-start">
                      <Mail className="h-4 w-4 text-yellow-300" /> 
                      <a href="mailto:ogrcs@yahoo.com" className="text-sm hover:text-yellow-300 transition-colors">ogrcs@yahoo.com</a>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <div className="flex items-start space-x-2 justify-center sm:justify-start">
                      <MapPin className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/90">Ota, Ogun State</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <img 
                      src={schoolFlyer} 
                      alt="Our God Reigns Crystal School - Admission in Progress"
                      className="rounded-xl shadow-elegant w-full max-w-md mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 fill-background">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Graduation Success Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <img 
                  src={graduateIndividual} 
                  alt="Our God Reigns Crystal School Graduate"
                  className="rounded-lg shadow-elegant w-full max-w-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-emerald-800 mb-4">Celebrating Our Graduates</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Our graduates represent the pinnacle of academic excellence and moral integrity. Each year, 
                  we celebrate their achievements as they transition to the next phase of their educational journey, 
                  equipped with knowledge, character, and the light to illuminate the world.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">Outstanding WAEC & NECO Performance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-700">Comprehensive Academic Foundation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Strong Christian Values & Character</span>
                  </div>
                </div>
                <Link to="/gallery" className="inline-block mt-6">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    View More Achievements
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Our School */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">About Our God Reigns Crystal School</h2>
              <p className="text-xl text-muted-foreground">A place for academic and moral excellence - Light to the World</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
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
              <div className="flex justify-center order-1 lg:order-2">
                <img 
                  src={galleryImages[0] || graduateIndividual} 
                  alt="Our God Reigns Crystal School Students"
                  className="rounded-lg shadow-elegant w-full max-w-md"
                  onError={handleImageError}
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Proprietress Welcome Address - 2025/2026 Session</h2>
            </div>
            
            <Card className="overflow-hidden group hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-elegant">
                      <img 
                        src={proprietress} 
                        alt="Pastor (Mrs) Kehinde Adetuberu - Proprietress"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Pastor (Mrs) Kehinde Adetuberu</h3>
                  <p className="text-accent font-semibold text-lg mb-6">Proprietress</p>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    "Distinguished Parents, Guardians, Staff, and Beloved Students, It is with great joy and gratitude to God Almighty that I warmly and sincerely welcome you all to the first term of the 2025/2026 academic session."
                  </p>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    "To our returning students, welcome back! We are delighted to see your bright faces again, and we trust you had a refreshing holiday. To our new students and parents joining our school family for the first time, we say a heartfelt welcome."
                  </p>
                  <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                    "You are now part of a nurturing community where excellence, discipline, and character-building remain our watchwords. The start of a new academic year is always a season of fresh opportunities."
                  </p>
                  {showFullAddress && (
                    <>
                      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                        "It is a time to set new goals, embrace new challenges, and strive for greater achievements. In Our God Reigns Crystal School, we remain committed to providing a safe, stimulating, and supportive environment where every child can discover and develop their unique potential."
                      </p>
                      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                        "To our dear teachers and staff, I commend your tireless dedication and commitment. Together, let us continue to inspire, mentor, and guide our students towards academic excellence and moral uprightness. To our parents and guardians, we deeply appreciate your trust and partnership."
                      </p>
                      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                        "Your cooperation and support are invaluable as we work hand in hand to shape the future of our children. My admonition to our students this term is simple: be focused, be diligent, and be disciplined. Remember, success comes through hard work, respect, and consistency."
                      </p>
                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                        "Let this new session be marked by renewed dedication to excellence in all areas of your academic journey. May God bless you all as we embark on this exciting journey together."
                      </p>
                      <div className="text-center pt-4 border-t border-muted">
                        <p className="text-muted-foreground font-semibold">
                          Pastor (Mrs) Kehinde Adetuberu<br />
                          <span className="text-accent">Proprietress</span>
                        </p>
                      </div>
                    </>
                  )}
                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowFullAddress(!showFullAddress)}
                      className="border-primary/20 hover:bg-primary/10 text-primary hover:text-primary"
                    >
                      {showFullAddress ? 'Show Less' : 'Read Full Address'}
                      <ArrowRight className={`h-4 w-4 ml-2 transform transition-transform ${showFullAddress ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-16 bg-gradient-to-br from-accent/10 via-primary/10 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Academic Programs 2025/2026</h2>
              <p className="text-xl text-muted-foreground">Excellence in Junior & Senior Secondary Education</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Junior Secondary (JSS 1-3)</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Comprehensive foundation in core subjects with emphasis on character development, 
                    critical thinking, and practical learning approaches that prepare students for advanced studies.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Mathematics, English Language & Sciences</p>
                    <p>• Social Studies & Basic Technology</p>
                    <p>• Computer Studies & Vocational Skills</p>
                    <p>• Moral & Religious Education</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl text-primary">Senior Secondary (SSS 1-3)</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Specialized education with focus on WAEC & NECO preparation, career guidance, 
                    and leadership development to prepare students for tertiary education and future success.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Science, Commercial & Arts Streams</p>
                    <p>• WAEC & NECO Preparation</p>
                    <p>• Career Guidance & Counseling</p>
                    <p>• Leadership & Character Formation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Access Portals */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Access School Portals</h2>
              <p className="text-xl text-muted-foreground">Quick access to our digital learning and management systems</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PortalCard
                title="Admin Portal"
                description="School administration and management access"
                icon={Shield}
                path="/portals/admin"
                color="primary"
              />
              
              <PortalCard
                title="Staff Portal"
                description="Teachers and staff resources"
                icon={Users}
                path="/portals/staff"
                color="secondary"
              />
              
              <PortalCard
                title="Parent Portal"
                description="Track your child's progress"
                icon={Heart}
                path="/portals/parent"
                color="accent"
              />
              
              <PortalCard
                title="Student Portal"
                description="Access learning materials and grades"
                icon={BookOpen}
                path="/portals/student"
                color="navy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Our God Reigns Crystal School</h2>
              <p className="text-xl text-muted-foreground">Excellence in education with Christian values</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Academic Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Consistent outstanding performance in WAEC, NECO, and other examinations with national recognition.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-primary">Character Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Strong emphasis on moral values, discipline, and Christian character formation in all students.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Qualified Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experienced and dedicated teaching staff committed to nurturing each student's potential.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-primary">Affordable Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Quality education at affordable rates, making excellent education accessible to all families.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Safe Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Secure and nurturing environment where students can learn and grow without fear.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-primary">Holistic Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprehensive approach to education covering academics, sports, arts, and spiritual growth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life & Gallery */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Campus Life & Gallery</h2>
              <p className="text-xl text-muted-foreground">Discover life at Our God Reigns Crystal School</p>
            </div>
            
            {galleryImages.length > 0 && (
              <div className="relative bg-white rounded-lg shadow-elegant overflow-hidden mb-8">
                <div className="relative h-96">
                  <img 
                    src={galleryImages[currentGalleryImage]} 
                    alt={`Gallery Image ${currentGalleryImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm opacity-90">
                      Image {currentGalleryImage + 1} of {galleryImages.length}
                    </p>
                  </div>
                  
                  {galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <Link to="/gallery">
                <Button size="lg" className="bg-gradient-primary">
                  View Full Gallery
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Latest News & Events</h2>
              <p className="text-xl text-muted-foreground">Stay updated with our school community</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-6 bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={handleImageError}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3 hover:text-primary/80 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" size="sm" className="p-0 text-primary hover:text-primary/80">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">No Recent Posts</h3>
                <p className="text-muted-foreground">Check back soon for the latest news and updates!</p>
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/blog">
                <Button variant="outline" size="lg">
                  View All Posts
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Home;