import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SuccessModal from "@/components/SuccessModal";
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Shield, 
  Heart, 
  Target, 
  Lightbulb,
  Users,
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Library,
  Microscope,
  Utensils,
  Bus,
  Trophy,
  GraduationCap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import proprietress from "@/assets/proprietress.jpg";
import schoolFlyer from "@/assets/school-flyer.jpg";
import studentsGreenUniforms from "@/assets/students-green-uniforms.jpg";
import libraryInterior from "@/assets/library-interior.jpg";
import heroStudents from "@/assets/hero-students-performance.jpg";

// Fallback images for gallery
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
  const [loading, setLoading] = useState(true);

  const fallbackGalleryImages = [
    gallery1, gallery2, gallery3, achievement, awardCeremony, culturalDance
  ];

  useEffect(() => {
    fetchDynamicContent();
    
    const postsChannel = supabase
      .channel('homepage-posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchBlogPosts();
      })
      .subscribe();

    const galleryChannel = supabase
      .channel('homepage-gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, () => {
        fetchGalleryImages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(galleryChannel);
    };
  }, []);

  const fetchDynamicContent = async () => {
    setLoading(true);
    await Promise.all([fetchBlogPosts(), fetchGalleryImages()]);
    setLoading(false);
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
          date: new Date(post.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          category: 'News',
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

  const proprietressAddress = {
    short: "Welcome to Our God Reigns Crystal School, where academic excellence meets moral integrity. We are committed to nurturing future leaders through quality education grounded in Christian values. Our dedicated staff ensures every child receives personalized attention in a safe, inspiring environment.",
    full: "Welcome to Our God Reigns Crystal School, where academic excellence meets moral integrity. We are committed to nurturing future leaders through quality education grounded in Christian values. Our dedicated staff ensures every child receives personalized attention in a safe, inspiring environment.\n\nAt OGRCS, we believe in developing the whole child - academically, spiritually, morally, and socially. Our modern facilities and experienced educators work together to create an atmosphere where students can thrive and discover their God-given potential.\n\nWe invite you to join our growing family of excellence, where every child is valued and equipped for a bright future. Together, we are building tomorrow's leaders with integrity, knowledge, and divine purpose."
  };

  const coreValues = [
    { icon: Heart, title: "Faith & Integrity", description: "Building strong Christian character and moral foundation" },
    { icon: BookOpen, title: "Academic Excellence", description: "Delivering quality education that empowers minds" },
    { icon: Users, title: "Community", description: "Fostering a supportive and inclusive learning environment" },
    { icon: Target, title: "Purpose", description: "Helping students discover and fulfill their divine calling" }
  ];

  const differentiators = [
    "Experienced and dedicated Christian teachers",
    "Modern learning facilities and resources",
    "Small class sizes for personalized attention",
    "Strong emphasis on moral and spiritual development",
    "Proven track record of academic excellence",
    "Safe and nurturing school environment"
  ];

  const facilities = [
    { icon: Library, name: "Modern Library", description: "Well-stocked with books and digital resources", image: libraryInterior },
    { icon: Microscope, name: "Science Laboratory", description: "Equipped for practical experiments", image: achievement },
    { icon: Trophy, name: "Sports Facilities", description: "Indoor and outdoor recreational areas", image: culturalDance },
    { icon: Utensils, name: "Cafeteria", description: "Nutritious meals in a clean environment", image: gallery2 },
    { icon: Bus, name: "Transportation", description: "Safe and reliable school bus service", image: gallery3 },
    { icon: GraduationCap, name: "Auditorium", description: "For assemblies and special events", image: awardCeremony }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[550px] md:min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroStudents} 
            alt="Our Students"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          {/* Very Transparent Overlay */}
          <div className="absolute inset-0 bg-gradient-hero"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 md:py-16 min-h-[550px] md:min-h-[600px]">
            {/* Left Side - Text Content */}
            <div className="flex-1 space-y-6 text-left">
              <Badge className="bg-accent text-primary hover:bg-accent/90 text-lg px-6 py-2 font-bold inline-block">
                <GraduationCap className="mr-2 h-5 w-5 inline" />
                ADMISSION OPEN 2025/2026
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight drop-shadow-lg">
                Our God Reigns<br />
                <span className="text-accent">Crystal School</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-accent font-bold drop-shadow-md">
                Light to the World
              </p>
              
              <p className="text-lg text-navy/90 font-medium drop-shadow-sm">
                ...a place for academic and moral excellence
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/admissions">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-6 shadow-elegant">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Apply Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-2 border-navy bg-card/80 backdrop-blur-sm text-navy hover:bg-navy hover:text-white font-bold text-base px-6 shadow-soft">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - School Flyer */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src={schoolFlyer} 
                  alt="Our God Reigns Crystal School - Admission in Progress" 
                  className="rounded-2xl shadow-2xl w-full max-w-lg"
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Proprietress Welcome Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Proprietress' Welcome Address
              </h2>
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                First Term 2025/2026 Academic Session
              </Badge>
            </div>

            <Card className="overflow-hidden shadow-xl bg-accent/5 border-2 border-accent/20">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-20 h-20 bg-accent rounded-full opacity-20"></div>
                      <img 
                        src={proprietress} 
                        alt="Pastor (Mrs) Kehinde Adetuberu"
                        className="relative rounded-2xl w-48 h-56 object-cover border-4 border-accent shadow-lg"
                        onError={handleImageError}
                      />
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold">
                        99
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-muted-foreground text-base leading-relaxed mb-6">
                        {showFullAddress ? proprietressAddress.full : proprietressAddress.short}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="font-bold text-primary text-lg">
                        Pastor (Mrs) Kehinde Adetuberu
                      </p>
                      <p className="text-muted-foreground text-sm">Proprietress</p>
                    </div>
                      
                    <Button 
                      onClick={() => setShowFullAddress(!showFullAddress)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {showFullAddress ? "Show Less" : "Read Full Address"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. About Our School - Excellence in Education */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Excellence in Education
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our God Reigns Crystal School is a beacon of academic excellence and moral integrity, committed to nurturing young minds and shaping future leaders.
              </p>
            </div>

            {/* Core Values */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center text-foreground mb-10">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreValues.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center">
                        <value.icon className="h-10 w-10 text-accent" />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What Makes Us Different */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-foreground mb-10">
                What Makes Us Different?
              </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Side - Vision & Mission */}
              <div className="space-y-6">
                <Card className="bg-accent/5 border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <Target className="h-6 w-6" />
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To provide qualitative and affordable education. To raise God fearing leaders.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <Target className="h-6 w-6" />
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To maintain high standard at all times. To always ensure that our services are not overpriced. To nurture our students in the way of the Lord. To mentor our students to occupy leadership positions.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Differentiators */}
              <div className="space-y-4">
                <Card className="bg-accent/10 border-accent/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      Complete Secondary Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Full JSS 1-3 and SSS 1-3 programs with WAEC/NECO preparation
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      Technology Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Modern E-Note system and AI-enhanced learning experiences
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      Qualified Teaching Staff
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Experienced, dedicated educators committed to student success
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      Character Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Strong emphasis on moral values, discipline, and leadership skills
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Programs Offered */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent text-accent-foreground px-6 py-2 text-base">
                Our Programs
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Academic <span className="text-primary">Programs</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-primary/30">
                <div className="h-2 bg-gradient-primary"></div>
                <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Junior Secondary (JSS)</CardTitle>
                      <CardDescription className="text-base">JSS 1 - JSS 3</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-3">
                    {[
                      "Comprehensive curriculum aligned with national standards",
                      "Strong foundation in core subjects",
                      "Character development and moral education",
                      "Co-curricular activities and sports"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/admissions">
                    <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                      Apply for JSS
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-accent/30">
                <div className="h-2 bg-gradient-accent"></div>
                <CardHeader className="bg-gradient-to-br from-accent/10 to-primary/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Senior Secondary (SSS)</CardTitle>
                      <CardDescription className="text-base">SSS 1 - SSS 3</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-3">
                    {[
                      "WAEC and NECO exam preparation",
                      "Science, Arts, and Commercial streams",
                      "University admission guidance",
                      "Leadership and career development"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/admissions">
                    <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Apply for SSS
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 4. School Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary text-primary-foreground px-6 py-2 text-base">
                Gallery
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Life at <span className="text-primary">OGRCS</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={galleryImages[currentGalleryImage]}
                    alt={`Gallery ${currentGalleryImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-primary/30"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-primary/30"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="flex justify-center gap-2 mt-6">
                  {galleryImages.slice(0, 6).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGalleryImage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentGalleryImage
                          ? "bg-primary w-8"
                          : "bg-primary/30 hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link to="/gallery">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      View Full Gallery
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. School News & Updates */}
      <section className="py-16 bg-gradient-to-br from-accent/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent text-accent-foreground px-6 py-2 text-base">
                Latest Updates
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                News & <span className="text-primary">Announcements</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-primary text-primary">
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" className="w-full text-primary hover:bg-primary/10">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No news articles available at the moment.</p>
                  <Link to="/blog">
                    <Button variant="outline">View All News</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {blogPosts.length > 0 && (
              <div className="text-center mt-12">
                <Link to="/blog">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    View All News
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. School Facilities */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Our Campus
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                School Facilities
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Facilities List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Library className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Well-Stocked Library</h3>
                    <p className="text-sm text-muted-foreground">Over 5,000 books and digital resources</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Microscope className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">ICT Laboratory</h3>
                    <p className="text-sm text-muted-foreground">30+ computers with high-speed internet</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Microscope className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Science Laboratories</h3>
                    <p className="text-sm text-muted-foreground">Physics, Chemistry & Biology labs</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Trophy className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Sports Facilities</h3>
                    <p className="text-sm text-muted-foreground">Football field, basketball court & athletics track</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">24/7 Security System</h3>
                    <p className="text-sm text-muted-foreground">CCTV monitoring and trained security personnel</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Digital Learning</h3>
                    <p className="text-sm text-muted-foreground">Campus-wide Wi-Fi and E-Note system</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Modern Classrooms</h3>
                    <p className="text-sm text-muted-foreground">30+ spacious, well-ventilated classrooms</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-primary/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <GraduationCap className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-bold text-lg mb-2">Administrative Block</h3>
                    <p className="text-sm text-muted-foreground">Organized offices for efficient management</p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Image Collage */}
              <div className="relative">
                <div className="bg-foreground rounded-3xl p-2 shadow-2xl">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 rounded-2xl overflow-hidden">
                      <img 
                        src={libraryInterior} 
                        alt="Library"
                        className="w-full h-48 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden">
                      <img 
                        src={achievement} 
                        alt="Laboratory"
                        className="w-full h-40 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden">
                      <img 
                        src={culturalDance} 
                        alt="Sports"
                        className="w-full h-40 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="col-span-2 rounded-2xl overflow-hidden">
                      <img 
                        src={studentsGreenUniforms} 
                        alt="Students"
                        className="w-full h-48 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold">
                  Schedule Campus Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Get in Touch */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent text-accent-foreground px-6 py-2 text-base">
                Contact Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                We'd love to hear from you. Visit us or reach out today!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/95 backdrop-blur shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-muted-foreground">
                        23, Bolanle Awosika Street, off Ilogbo Road,<br />
                        Borehole, Ota, Ogun State
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground">
                        08027625129, 08053089735
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground">ogrcs@yahoo.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Office Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/admissions">
                    <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-lg py-6">
                      <Award className="h-5 w-5 mr-3" />
                      Apply for Admission
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-6">
                      <BookOpen className="h-5 w-5 mr-3" />
                      Learn More About Us
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" className="w-full justify-start border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg py-6">
                      <Mail className="h-5 w-5 mr-3" />
                      Send Us a Message
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Welcome to OGRCS!"
        message="We're glad you're here. Explore our website to learn more about our school."
      />
    </div>
  );
};

export default Home;
