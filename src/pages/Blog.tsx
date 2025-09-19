import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, ArrowRight, Filter, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

import awardCeremony from "@/assets/award-ceremony.jpg";
import gallery1 from "@/assets/gallery1.jpg";
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

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Academics", "Awards", "Campus Life", "Events", "News", "Sports"];

  const blogPosts = [
    {
      id: 1,
      title: "NECO Excellence Awards 2025: Miss Adeyemo Emmanuella Adedamola Wins Best Female SSCE Candidate",
      excerpt: "We are thrilled to announce that our student, Miss Adeyemo Emmanuella Adedamola, has been awarded the Best Female Senior School Certificate Examination (SSCE) candidate in Nigeria for 2025, showcasing our commitment to academic excellence in the 2025/2026 session...",
      content: `We are proud to celebrate the outstanding achievements of our student at the 2025 NECO Excellence Awards. This recognition is a testament to the hard work, dedication, and excellence that defines Our God Reigns Crystal School.

Our student, Miss Adeyemo Emmanuella Adedamola, was awarded the Best Female Senior School Certificate Examination (SSCE) candidate in Nigeria for 2025. This remarkable achievement highlights not only her personal dedication but also the quality of education we provide at Our God Reigns Crystal School during the 2025/2026 academic session.

The award ceremony was a moment of immense pride for our entire school community. Seeing our students recognized on a national level reinforces our mission to provide education that truly makes our students "Light to the World."

We congratulate all our students, teachers, and staff who contributed to this success. This achievement motivates us to continue striving for excellence in all aspects of education as we continue the 2025/2026 academic session.`,
      date: "2025-09-15",
      category: "Awards",
      author: "School Administration",
      readTime: "3 min read",
      featured: true,
      image: necoExcellenceAwards
    },
    {
      id: 2,
      title: "Million Naira Achievement Fund Launch for 2025/2026 Session", 
      excerpt: "Our God Reigns Crystal School launches the Million Naira Achievement Fund to support exceptional students and academic programs for the 2025/2026 academic session, reinforcing our commitment to excellence...",
      content: `We are excited to announce the launch of our Million Naira Achievement Fund for the 2025/2026 academic session. This initiative demonstrates our commitment to supporting academic excellence and recognizing outstanding achievements.

The fund will provide financial support for:
- Outstanding students pursuing higher education
- Academic excellence scholarships
- Educational materials and resources
- Special recognition awards for exceptional performance

This investment in our students' futures reflects our belief that every child deserves the opportunity to excel and become a "Light to the World."

Applications for the achievement fund are now open for the 2025/2026 academic session. Eligible students will be selected based on academic performance, character development, and leadership potential.`,
      date: "2025-09-12",
      category: "News",
      author: "Management",
      readTime: "2 min read",
      featured: false,
      image: millionNaira
    },
    {
      id: 3,
      title: "Award Ceremony Officials Visit - 2025/2026 Session Recognition",
      excerpt: "Distinguished officials visit our school for the annual award ceremony, recognizing outstanding academic performance and moral excellence during the 2025/2026 academic session...",
      content: `We were honored to host distinguished officials at our annual award ceremony for the 2025/2026 academic session. The ceremony recognized exceptional academic achievements and character development among our students.

The visiting officials commended our school's commitment to excellence and the outstanding performance of our students. They noted the balanced approach we take in developing both academic competence and strong moral character.

Key highlights of the ceremony included:
- Recognition of top-performing students
- Awards for character development
- Appreciation for dedicated teachers and staff
- Presentation of academic achievement certificates

This recognition reinforces our position as a leading educational institution in Nigeria and our mission to be a "Light to the World" through quality education.`,
      date: "2025-09-08",
      category: "Awards",
      author: "Event Coordinator",
      readTime: "3 min read",
      featured: false,
      image: awardCeremonyOfficials
    },
    {
      id: 4,
      title: "Cultural Heritage Celebration 2025/2026",
      excerpt: "Our students showcase their rich cultural heritage through dance, drama, and artistic expressions during our annual cultural week celebration for the 2025/2026 session...",
      content: `Our annual Cultural Heritage Celebration for the 2025/2026 academic session was a spectacular showcase of Nigerian culture and traditions. Students from all levels participated enthusiastically in various cultural activities.

The celebration featured:
- Traditional dance performances from different Nigerian cultures
- Drama presentations highlighting moral values
- Art exhibitions displaying student creativity
- Cultural dress parade showcasing Nigerian attire
- Poetry recitations in local languages

This event not only celebrates our rich heritage but also instills pride in our students about their cultural identity. It aligns with our mission to develop well-rounded individuals who are proud of their roots while being prepared for global opportunities.

The celebration was a testament to the diverse talents of our students and their commitment to preserving and promoting Nigerian culture.`,
      date: "2025-09-05",
      category: "Campus Life", 
      author: "Cultural Affairs",
      readTime: "4 min read",
      featured: false,
      image: culturalDance
    },
    {
      id: 5,
      title: "Certificate Presentation Ceremony - Academic Excellence 2025/2026",
      excerpt: "Annual certificate presentation ceremony recognizing academic achievements and character development of our graduating students for the 2025/2026 session...",
      content: `Our annual Certificate Presentation Ceremony for the 2025/2026 academic session was a proud moment for students, parents, and staff. The ceremony celebrated the academic achievements and character development of our students.

Certificates were awarded for:
- Outstanding academic performance across all subjects
- Leadership and character development
- Community service and social responsibility
- Special talents and achievements
- Perfect attendance and dedication

The ceremony featured inspiring speeches from the proprietress, principal, and distinguished guests who encouraged students to continue striving for excellence in all their endeavors.

Parents and guardians expressed their appreciation for the quality education and character formation provided by Our God Reigns Crystal School. The event concluded with a commitment from all stakeholders to continue supporting academic excellence and moral development.`,
      date: "2025-09-03",
      category: "Academics",
      author: "Academic Office",
      readTime: "3 min read",
      featured: false,
      image: certificatePresentation
    },
    {
      id: 6,
      title: "Welcome New Students - 2025/2026 Academic Session",
      excerpt: "Welcome to Academic Session 2025/2026! Our new students begin their journey of academic excellence and character building at Our God Reigns Crystal School...",
      content: `We extend a warm welcome to all new students joining Our God Reigns Crystal School for the 2025/2026 academic session. Your enrollment marks the beginning of an exciting journey of learning, growth, and character development.

New Student Orientation includes:
- Introduction to school values and expectations
- Academic program overview and course selection
- Campus tour and facility orientation
- Meet and greet with teachers and staff
- Uniform fitting and school supplies

Our comprehensive orientation program ensures that every new student transitions smoothly into our school community. We are committed to providing a supportive environment where each student can discover their potential and excel academically.

To our returning students, welcome back! Together with our new students, let's make the 2025/2026 academic session one of outstanding achievement and growth.

Remember, at Our God Reigns Crystal School, every student is destined to be a "Light to the World."`,
      date: "2025-09-01",
      category: "Academics",
      author: "Student Affairs",
      readTime: "2 min read",
      featured: false,
      image: studentsGroup
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Blog Theme */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-700 to-pink-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">School Blog</h1>
                <p className="text-xl text-white/90 mb-6">Stay updated with the latest news, events, and achievements</p>
                <p className="text-white/80">Celebrating our students' success and school community</p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={awardWinner} 
                  alt="Award Winner Emmanuella"
                  className="rounded-lg shadow-2xl w-full max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "All" && (
          <Card className="mb-12 overflow-hidden hover:shadow-elegant transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="h-64 md:h-full w-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="default">Featured</Badge>
                  <Badge variant="outline">{featuredPost.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4 hover:text-primary/80 transition-colors">
                  <Link to={`/blog/${featuredPost.id}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.id}`}>
                    <Button variant="outline">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map(post => (
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
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;