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
      image: necoAwards
    },
    {
      id: 2,
      title: "Welcome to Academic Session 2025/2026: A New Beginning",
      excerpt: "As we commence the 2025/2026 academic year, we extend a warm welcome to all returning students, new students, and their families. This session promises to be filled with learning, growth, and exciting opportunities as we continue our mission as 'Light to the World'...",
      content: `Welcome to the 2025/2026 academic session at Our God Reigns Crystal School! We are excited to begin another year of academic excellence and character development.

This session brings new opportunities for learning, personal growth, and character development. We have introduced enhanced learning programs, updated our facilities, and welcomed new qualified teachers to our team for the 2025/2026 academic year.

Parents are reminded that registration is ongoing for new students, and all returning students should complete their registration process by the specified deadlines. Our administrative team is available to assist with any enrollment or academic questions.

We look forward to a productive and successful 2025/2026 academic year together!`,
      date: "2025-09-10",
      category: "Academics",
      author: "Principal's Office",
      readTime: "2 min read",
      featured: false,
      image: gallery1
    },
    {
      id: 3,
      title: "Building Character Through Campus Life Activities",
      excerpt: "Character development is at the core of our educational philosophy. Through various campus life activities, our students learn valuable life lessons that extend far beyond the classroom...",
      content: `At Our God Reigns Crystal School, we believe that education extends far beyond academic learning. Character development is integral to our mission of producing well-rounded individuals who will be positive influences in society.

Our campus life activities are carefully designed to instill values such as leadership, teamwork, integrity, and service to others. Through inter-house competitions, cultural celebrations, community service projects, and leadership opportunities, students develop essential life skills.

Recent activities have included:
- Inter-house sports competitions promoting teamwork and healthy competition
- Cultural day celebrations showcasing our rich heritage
- Community outreach programs teaching service and empathy
- Leadership workshops for senior students

These activities complement our academic programs and help students develop into confident, capable, and caring individuals ready to make a positive impact in the world.`,
      date: "2024-09-05",
      category: "Campus Life",
      author: "Student Affairs",
      readTime: "4 min read",
      featured: false,
      image: "/placeholder-campus.jpg"
    },
    {
      id: 4,
      title: "Inter-House Sports Competition 2024: Unity in Diversity",
      excerpt: "The annual inter-house sports competition brought together students from all levels in a celebration of athleticism, teamwork, and school spirit...",
      content: `The 2024 Inter-House Sports Competition was a spectacular display of athletic prowess, school spirit, and unity. Students from all houses came together to compete in various sporting events while maintaining the values of fair play and sportsmanship.

The competition featured events including track and field, football, basketball, volleyball, and traditional games. Each house demonstrated exceptional preparation and team spirit throughout the event.

Highlights included:
- Record-breaking performances in track events
- Exceptional teamwork in relay races
- Outstanding displays of sportsmanship
- Active participation from students across all levels

The competition concluded with an awards ceremony celebrating not just the winners, but all participants who embodied the school's values of excellence, integrity, and unity.

Congratulations to all participants and winners! The event truly showcased what it means to be part of the Our God Reigns Crystal School family.`,
      date: "2024-08-30",
      category: "Sports",
      author: "Sports Department",
      readTime: "3 min read",
      featured: false,
      image: "/placeholder-sports.jpg"
    },
    {
      id: 5,
      title: "Parent-Teacher Conference: Strengthening Home-School Partnership",
      excerpt: "Building strong partnerships between home and school is essential for student success. Our upcoming parent-teacher conference provides an opportunity for meaningful dialogue...",
      content: `We invite all parents and guardians to participate in our upcoming Parent-Teacher Conference scheduled for September 25, 2024. This conference is a vital opportunity to strengthen the partnership between home and school in supporting your child's academic and personal development.

During the conference, parents will have the opportunity to:
- Meet with subject teachers to discuss academic progress
- Review assessment results and areas for improvement
- Discuss your child's social and emotional development
- Learn about upcoming academic programs and activities
- Provide feedback on school programs and policies

The conference will be held from 10:00 AM to 4:00 PM in our main hall. Individual appointments with teachers can be scheduled through the school office.

We encourage all parents to attend as your involvement is crucial to your child's success. Together, we can ensure that every student reaches their full potential and truly becomes a "Light to the World."`,
      date: "2024-08-25",
      category: "Events",
      author: "Parent Relations",
      readTime: "2 min read",
      featured: false,
      image: "/placeholder-conference.jpg"
    },
    {
      id: 6,
      title: "Academic Excellence: Our WAEC Results Shine Bright",
      excerpt: "Our students have once again demonstrated exceptional performance in the West African Examinations Council (WAEC) examinations, maintaining our reputation for academic excellence...",
      content: `We are delighted to announce the outstanding performance of our students in the 2024 West African Senior School Certificate Examination (WASSCE). Our results continue to reflect our commitment to academic excellence and quality education.

Key highlights of our performance include:
- 98% pass rate in English Language
- 95% pass rate in Mathematics  
- 92% overall pass rate across all subjects
- 15 students achieved distinctions in 7 or more subjects
- Exceptional performance in Sciences and Mathematics

These results are a testament to the dedication of our students, the expertise of our teaching staff, and the supportive learning environment we have created. Our comprehensive approach to education, combining rigorous academics with character development, continues to produce well-rounded graduates.

We congratulate all our students for their hard work and dedication. Special recognition goes to our teachers who have consistently gone above and beyond to ensure student success.

These achievements reinforce our position as a leading educational institution and our mission to be a "Light to the World" through academic excellence.`,
      date: "2024-08-20",
      category: "Academics",
      author: "Academic Office",
      readTime: "3 min read",
      featured: true,
      image: "/placeholder-results.jpg"
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
      {/* Header */}
      <div className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">School Blog</h1>
            <p className="text-xl text-white/90">Stay updated with the latest news, events, and achievements</p>
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