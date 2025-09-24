import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortalCard from "@/components/PortalCard";
import SuccessModal from "@/components/SuccessModal";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Award, 
  BookOpen, 
  Shield, 
  Heart, 
  Target, 
  Eye, 
  Calendar, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CreditCard, 
  ChevronDown,
  Star,
  Trophy,
  Lightbulb,
  Globe,
  CheckCircle,
  Play,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import logo from "@/assets/logo.jpeg";
import proprietress from "@/assets/proprietress.jpg";
import chairman from "@/assets/chairman.jpg";
import principal from "@/assets/principal.jpg";
import vicePrincipal from "@/assets/vice-principal.jpg";
import schoolFlyer from "@/assets/school-flyer.jpg";
import graduateIndividual from "@/assets/graduate-individual.jpg";
import studentsGreenUniforms from "@/assets/students-green-uniforms.jpg";

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
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || post.content.substring(0, 120) + '...',
          date: new Date(post.created_at).toISOString().split('T')[0],
          category: 'News', // Default category since category doesn't exist in posts table
          image: post.featured_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E"
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

  const renderDynamicSection = (section: any) => {
    const { section_type, title, content, image_url, link_url, link_text } = section;

    switch (section_type) {
      case 'hero':
        return (
          <section key={section.id} className="relative min-h-[70vh] md:min-h-[55vh] flex items-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${image_url || studentsGreenUniforms})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/80"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px] opacity-40"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="text-white space-y-6 lg:space-y-8">
                    <div className="space-y-4 lg:space-y-6">
                      <div className="inline-flex items-center bg-accent/90 backdrop-blur-sm rounded-full px-4 lg:px-6 py-2 lg:py-3 text-accent-foreground font-medium">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-sm lg:text-base">Admission Open for 2025/2026 Session</span>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                        <span className="block text-white drop-shadow-lg">{title || "Our God Reigns"}</span>
                        <span className="block text-accent drop-shadow-lg">Crystal School</span>
                      </h1>
                      
                      <div className="space-y-2 lg:space-y-3">
                        <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/95 drop-shadow">Light to the World</p>
                        <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg drop-shadow">
                          {content || "Where academic excellence meets Christian values. Nurturing tomorrow's leaders with integrity, knowledge, and divine purpose."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-white/30">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                            <div>
                              <p className="font-semibold text-white text-sm lg:text-base">JSS & SSS</p>
                              <p className="text-xs lg:text-sm text-white/80">Available Classes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-white/30">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <Award className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                            <div>
                              <p className="font-semibold text-white text-sm lg:text-base">Excellence</p>
                              <p className="text-xs lg:text-sm text-white/80">Academic Record</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                        {link_url ? (
                          <Link to={link_url}>
                            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg shadow-elegant">
                              {link_text || "Apply for Admission"}
                              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                            </Button>
                          </Link>
                        ) : (
                          <Link to="/admissions">
                            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg shadow-elegant">
                              Apply for Admission
                              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                            </Button>
                          </Link>
                        )}
                        <Link to="/about">
                          <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center lg:justify-end">
                    <div className="relative">
                      <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 bg-accent/20 rounded-full blur-xl"></div>
                      <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl"></div>
                      
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-2xl">
                        <img 
                          src={image_url || schoolFlyer} 
                          alt="Our God Reigns Crystal School - Admission in Progress"
                          className="rounded-xl shadow-elegant w-full max-w-xs lg:max-w-md mx-auto"
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" className="w-full h-8 lg:h-12 fill-background">
                <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
              </svg>
            </div>
          </section>
        );

      case 'proprietress_address':
        return (
          <section key={section.id} className="py-16 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Card className="overflow-hidden shadow-elegant bg-gradient-to-br from-white via-primary/5 to-accent/5 border-primary/20">
                  <CardContent className="p-8 lg:p-12">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                        <Heart className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                        {title || "Proprietress Welcome Address"}
                      </h2>
                    </div>
                    
                    {image_url && (
                      <div className="flex justify-center mb-8">
                        <div className="relative">
                          <img 
                            src={image_url} 
                            alt="Proprietress"
                            className="rounded-lg shadow-elegant w-32 h-32 lg:w-40 lg:h-40 object-cover border-4 border-primary/20"
                            onError={handleImageError}
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-accent-foreground" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="prose prose-lg max-w-none">
                      <div className="text-muted-foreground text-base lg:text-lg leading-relaxed space-y-4 text-justify">
                        {content && content.split('\n\n').map((paragraph: string, index: number) => {
                          if (paragraph.includes('Pastor (Mrs) Kehinde Adetuberu')) {
                            return (
                              <div key={index} className="text-right mt-8 border-t border-primary/20 pt-6">
                                <p className="font-semibold text-primary text-lg">
                                  {paragraph}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <p key={index} className="mb-4">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                      
                      {link_url && link_text && (
                        <div className="text-center mt-8">
                          <Link to={link_url}>
                            <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                              {link_text}
                              <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section (Banner) */}
      {homepageContent.find(section => section.section_type === 'hero') ? 
        renderDynamicSection(homepageContent.find(section => section.section_type === 'hero'))
        : 
        /* Fallback Hero Section when no content is available */
        <section className="relative min-h-[70vh] md:min-h-[55vh] flex items-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${studentsGreenUniforms})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/80"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px] opacity-40"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="text-white space-y-6 lg:space-y-8">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="inline-flex items-center bg-accent/90 backdrop-blur-sm rounded-full px-4 lg:px-6 py-2 lg:py-3 text-accent-foreground font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                      <span className="text-sm lg:text-base">Admission Open for 2025/2026 Session</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                      <span className="block text-white drop-shadow-lg">Our God Reigns</span>
                      <span className="block text-accent drop-shadow-lg">Crystal School</span>
                    </h1>
                    
                    <div className="space-y-2 lg:space-y-3">
                      <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/95 drop-shadow">Light to the World</p>
                      <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg drop-shadow">
                        Where academic excellence meets Christian values. Nurturing tomorrow's leaders with integrity, knowledge, and divine purpose.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-white/30">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <BookOpen className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                          <div>
                            <p className="font-semibold text-white text-sm lg:text-base">JSS & SSS</p>
                            <p className="text-xs lg:text-sm text-white/80">Available Classes</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-white/30">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <Award className="h-5 w-5 lg:h-6 lg:w-6 text-accent" />
                          <div>
                            <p className="font-semibold text-white text-sm lg:text-base">Excellence</p>
                            <p className="text-xs lg:text-sm text-white/80">Academic Record</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                      <Link to="/admissions">
                        <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg shadow-elegant">
                          Apply for Admission
                          <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 ml-2" />
                        </Button>
                      </Link>
                      <Link to="/about">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 bg-accent/20 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-3 -left-3 lg:-bottom-6 lg:-left-6 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-2xl">
                      <img 
                        src={schoolFlyer} 
                        alt="Our God Reigns Crystal School - Admission in Progress"
                        className="rounded-xl shadow-elegant w-full max-w-xs lg:max-w-md mx-auto"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-8 lg:h-12 fill-background">
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </section>
      }

      {/* 2. Celebrating Our Graduates */}
      <section className="py-16 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-full mb-6 shadow-elegant">
                <Trophy className="h-10 w-10 text-accent-foreground" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Celebrating Our Graduates
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our graduates continue to make us proud with their exceptional achievements in academics and leadership across the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">98%</div>
                      <div className="text-sm text-muted-foreground">WAEC Success Rate</div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-accent/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">95%</div>
                      <div className="text-sm text-muted-foreground">University Admission</div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">Awards Won</div>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-accent/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">Leadership Ready</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/gallery" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      View Graduate Gallery
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/about#achievements" className="flex-1">
                    <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                      Our Achievements
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={graduateIndividual} 
                    alt="Celebrating our graduates - Academic Excellence"
                    className="w-full h-96 object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Excellence in Every Graduate</h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Preparing students not just for examinations, but for life's greatest challenges with unwavering faith and determination.
                    </p>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Proprietress' Address */}
      {homepageContent.find(section => section.section_type === 'proprietress_address') && 
        renderDynamicSection(homepageContent.find(section => section.section_type === 'proprietress_address'))
      }

      {/* 3. About Us */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-accent/10 rounded-full px-6 py-3 mb-6">
                <CheckCircle className="h-5 w-5 text-accent-foreground mr-2" />
                <span className="text-accent-foreground font-semibold">About Our School</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">About Us</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our God Reigns Crystal School - Light to the World
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="order-2 lg:order-1">
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Our God Reigns Crystal School stands as a beacon of excellence in education, dedicated to nurturing young minds 
                    with both academic knowledge and moral values. We provide a comprehensive learning environment where students 
                    develop critical thinking skills, character, and leadership qualities.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Expert Teachers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Modern Facilities</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Christian Values</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Excellence Record</span>
                    </div>
                  </div>
                  
                  <Link to="/about">
                    <Button size="lg" className="text-lg px-8 py-4">
                      Learn More About Us
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-center order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
                  <img 
                    src={galleryImages[0] || graduateIndividual} 
                    alt="Our God Reigns Crystal School Students"
                    className="rounded-2xl shadow-elegant w-full max-w-lg relative z-10 border-4 border-white"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
            
            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Eye className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
                      <p className="text-muted-foreground">What drives us forward</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To provide qualitative and affordable education. To raise God fearing leaders who will be 
                    Light to the World in their respective fields.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <Target className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
                      <p className="text-muted-foreground">How we achieve excellence</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To maintain high standard at all times. To ensure our services are affordable. 
                    To nurture students in the way of the Lord and mentor them to occupy leadership positions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Academics */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <span className="text-primary font-semibold">Academic Programs</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Academics</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive educational programs designed to prepare students for excellence in academics and life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-white border-primary/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Junior Secondary School (JSS)</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Foundation years focusing on core subjects, character development, and discovery of individual talents and interests.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">JSS 1 - JSS 3</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Core Curriculum</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Character Formation</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 bg-white border-accent/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Senior Secondary School (SSS)</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Advanced learning with specialized tracks preparing students for higher education and professional careers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">SSS 1 - SSS 3</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">WAEC/NECO Preparation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">University Preparation</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Innovative Learning</h3>
                <p className="text-muted-foreground">Modern teaching methods combined with digital tools to enhance understanding and engagement.</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Character Building</h3>
                <p className="text-muted-foreground">Nurturing moral values and leadership skills alongside academic excellence.</p>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Global Standards</h3>
                <p className="text-muted-foreground">International curriculum standards adapted for Nigerian students to compete globally.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Admissions */}
      <section className="py-20 bg-gradient-to-br from-accent/10 via-primary/10 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-accent/20 rounded-full px-6 py-3 mb-6">
                <Calendar className="h-5 w-5 text-accent-foreground mr-2" />
                <span className="text-accent-foreground font-semibold">Enrollment Open</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Admissions</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join our community of learners for the 2025/2026 academic session
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 mb-8 border border-accent/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary">Admission in Progress</h3>
                      <p className="text-accent-foreground font-medium">Academic Session 2025/2026</p>
                    </div>
                  </div>
                  <p className="text-lg text-primary mb-6">Into JSS & SSS Classes</p>
                  <Link to="/admissions">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4">
                      Apply Now <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 border border-border/50 hover:shadow-elegant transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2">Small Class Sizes</h4>
                    <p className="text-muted-foreground">Personalized attention for every student</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-border/50 hover:shadow-elegant transition-all duration-300">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                      <CreditCard className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2">Affordable Fees</h4>
                    <p className="text-muted-foreground">Quality education at reasonable costs</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                  <img 
                    src={schoolFlyer} 
                    alt="Admission Flyer"
                    className="rounded-2xl shadow-elegant w-full max-w-lg relative z-10 border-4 border-white"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/admissions">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                  View Admission Requirements
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Achievements */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
                <Star className="h-4 w-4 text-primary mr-2" />
                <span className="text-primary font-semibold">Academic Excellence</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                Achievements
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Celebrating our students' exceptional performance and the school's commitment to excellence
              </p>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 text-center border border-primary/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground font-medium">WAEC Success Rate</p>
              </div>
              
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-6 text-center border border-accent/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-accent-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">12+</div>
                <p className="text-muted-foreground font-medium">Years Experience</p>
              </div>
              
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-6 text-center border border-secondary/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground font-medium">Students Mentored</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-2xl p-6 text-center border border-emerald-500/20 hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground font-medium">Awards Won</p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/about#achievements">
                <Button size="lg" className="text-lg px-8 py-4">
                  View All Achievements
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. News & Announcements */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-secondary/10 rounded-full px-6 py-3 mb-6">
                <Calendar className="h-5 w-5 text-secondary mr-2" />
                <span className="text-secondary font-semibold">Latest Updates</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">News & Announcements</h2>
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogPosts.map((post, index) => (
                    <Card key={index} className="overflow-hidden group hover:shadow-elegant transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge className="absolute top-4 right-4 bg-primary/90 text-white">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-2">
                          <span className="text-sm text-muted-foreground">{post.date}</span>
                        </div>
                        <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground line-clamp-3 mb-4">
                          {post.excerpt}
                        </CardDescription>
                        <Link to={`/blog/${post.id}`} className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Link to="/blog">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                      View All News
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-muted-foreground mb-4">No news available</h3>
                <p className="text-muted-foreground">Check back later for updates and announcements.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Portals & Contact Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Portals Section */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <span className="text-primary font-semibold">Digital Access</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">School Portals</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Access your dedicated dashboard for seamless school management and communication
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Admin Portal */}
                <PortalCard
                  title="Admin Portal"
                  description="Comprehensive school management, student records, staff management, and system administration"
                  icon={Shield}
                  path="/portals/admin"
                  color="primary"
                />
                
                {/* Staff Portal */}
                <PortalCard
                  title="Staff Portal"
                  description="Teacher resources, lesson plans, student management, and academic tools"
                  icon={Users}
                  path="/portals/staff"
                  color="secondary"
                />
                
                {/* Parent Portal */}
                <PortalCard
                  title="Parent Portal"
                  description="Monitor your child's progress, communicate with teachers, and stay updated"
                  icon={Heart}
                  path="/portals/parent"
                  color="accent"
                />
                
                {/* Student Portal */}
                <PortalCard
                  title="Student Portal"
                  description="Access assignments, grades, resources, and connect with classmates"
                  icon={BookOpen}
                  path="/portals/student"
                  color="navy"
                />
              </div>

              <div className="text-center">
                <Link to="/portals">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Explore All Portals
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div>
                <div className="mb-8">
                  <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-6">Get in Touch</h3>
                  <p className="text-lg text-muted-foreground">
                    Have questions? We're here to help. Contact us through any of these channels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Visit Us</h4>
                      <p className="text-muted-foreground">23, Bolanle Awosika Street, off Ilogbo Road, Borehole, Ota, Ogun State</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-secondary/10">
                      <Phone className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Call Us</h4>
                      <p className="text-muted-foreground">08027625129, 08033089735</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-accent/10">
                      <Mail className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Email Us</h4>
                      <p className="text-muted-foreground">ogrcs@yahoo.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-navy/10">
                      <Clock className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Office Hours</h4>
                      <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 4:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="w-full text-lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send us a Message
                    </Button>
                  </Link>
                  <Link to="/admissions">
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                      Apply for Admission
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Contact Form */}
              <div>
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-6 w-6 text-primary" />
                      <span>Quick Inquiry</span>
                    </CardTitle>
                    <CardDescription>
                      Send us a quick message and we'll get back to you soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                          <input
                            type="text"
                            placeholder="Your name"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                          <input
                            type="tel"
                            placeholder="Your phone"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                        <input
                          type="email"
                          placeholder="Your email"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                        <textarea
                          placeholder="Your message..."
                          rows={4}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Gallery */}
      <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
                <Play className="h-5 w-5 text-primary mr-2" />
                <span className="text-primary font-semibold">Campus Life</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Gallery</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the vibrant community and rich activities that make our school a second home for students
              </p>
            </div>
            
            {galleryImages.length > 0 && (
              <div className="relative bg-white rounded-2xl shadow-elegant overflow-hidden mb-12 border border-border/50">
                <div className="relative h-[32rem]">
                  <img 
                    src={galleryImages[currentGalleryImage]} 
                    alt={`Gallery Image ${currentGalleryImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Campus Moments</h3>
                        <p className="text-white/90">
                          Image {currentGalleryImage + 1} of {galleryImages.length}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {galleryImages.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentGalleryImage ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentGalleryImage(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20"
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
                <Button size="lg" className="bg-gradient-primary text-lg px-8 py-4">
                  Explore Full Gallery
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
        title="Welcome!" 
        message="Thank you for visiting our website. We're excited to be part of your educational journey!"
      />
    </div>
  );
};

export default Home;