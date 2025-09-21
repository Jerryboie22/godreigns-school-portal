import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPost();
    fetchAllPosts();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (data) {
        // Get the public URL for the image if it exists
        let imageUrl = data.featured_image;
        if (data.featured_image && data.featured_image.startsWith('http')) {
          // If image is already a full URL, use it
          imageUrl = data.featured_image;
        } else if (data.featured_image && !data.featured_image.startsWith('http')) {
          // If image is a storage path, get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(data.featured_image);
          imageUrl = publicUrlData.publicUrl;
        }
        
        setPost({
          ...data,
          featured_image: imageUrl,
          author: 'School Administration', // Use default since posts don't have author field
          readTime: `${Math.max(1, Math.ceil(data.content.length / 200))} min read`,
          date: new Date(data.created_at).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      // Fallback to static posts
      setPost(staticBlogPosts.find(p => p.id === parseInt(id || '')));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select('id, title, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (data) {
        setAllPosts(data.map(p => ({
          ...p,
          date: new Date(p.created_at).toISOString().split('T')[0]
        })));
      } else {
        setAllPosts(staticBlogPosts);
      }
    } catch (error) {
      setAllPosts(staticBlogPosts);
    }
  };

  // Static fallback posts
  const staticBlogPosts = [
    {
      id: 1,
      title: "Our God Reigns Crystal School Wins NECO Excellence Awards 2024",
      content: `We are proud to celebrate the outstanding achievements of our students at the 2024 NECO Excellence Awards. This recognition is a testament to the hard work, dedication, and excellence that defines Our God Reigns Crystal School.

Our student, Miss Adeyemo Emmanuella Adedamola, was awarded the Best Female Senior School Certificate Examination (SSCE) candidate in Nigeria for 2024. This remarkable achievement highlights not only her personal dedication but also the quality of education we provide at Our God Reigns Crystal School.

## A Moment of Pride

The award ceremony was a moment of immense pride for our entire school community. Seeing our students recognized on a national level reinforces our mission to provide education that truly makes our students "Light to the World."

The event was held at the prestigious venue where education stakeholders from across Nigeria gathered to celebrate academic excellence. Our representative, Miss Adedamola, received her award with grace and humility, embodying the values we instill in all our students.

## Academic Excellence in Action

This achievement is not an isolated incident but part of a consistent pattern of excellence at Our God Reigns Crystal School. Our students have consistently performed exceptionally well in national examinations, including:

- 98% pass rate in English Language
- 95% pass rate in Mathematics
- Outstanding performance across all science subjects
- Recognition in various academic competitions

## The Role of Our Teachers

We must acknowledge the crucial role our dedicated teaching staff played in this success. Their commitment to excellence, innovative teaching methods, and personal attention to each student creates an environment where academic achievement flourishes.

Our teachers go beyond curriculum delivery to mentor students, providing guidance that extends far beyond the classroom. This holistic approach to education is what sets Our God Reigns Crystal School apart.

## Christian Values Foundation

At the heart of our educational philosophy are strong Christian values that guide both academic pursuit and character development. We believe that true education must encompass both intellectual growth and moral development.

Miss Adedamola's achievement reflects not just academic excellence but also the character formation that comes from our value-based education system. She exemplifies the kind of well-rounded individual we strive to produce – academically excellent and morally upright.

## Looking Forward

This recognition motivates us to continue striving for excellence in all aspects of education. We are committed to maintaining the high standards that have earned us this recognition while constantly seeking ways to improve and innovate in our educational delivery.

We congratulate all our students, teachers, and staff who contributed to this success. This achievement is a collective victory that belongs to our entire school community.

## Conclusion

As we celebrate this remarkable achievement, we remain focused on our mission to provide quality education that produces not just academic achievers but individuals who will be positive influences in society. Miss Adedamola's success is a shining example of what is possible when excellence meets opportunity at Our God Reigns Crystal School.

We invite prospective students and parents to be part of this tradition of excellence. Together, we can continue to produce students who truly are "Light to the World."`,
      date: "2024-09-15",
      category: "Awards",
      author: "School Administration",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Welcome to New Academic Session 2024/2025",
      content: `Welcome to the 2024/2025 academic session at Our God Reigns Crystal School! We are excited to begin another year of academic excellence and character development.

This session brings new opportunities for learning, personal growth, and character development. We have introduced enhanced learning programs, updated our facilities, and welcomed new qualified teachers to our team.

## New Developments This Session

### Enhanced Learning Programs
We have expanded our curriculum to include more practical applications and real-world learning experiences. Our students will engage in:
- Project-based learning initiatives
- Enhanced STEM programs
- Expanded arts and cultural activities
- Community service projects

### Facility Upgrades
Over the break, we've made significant improvements to our facilities:
- Upgraded science laboratories with modern equipment
- Enhanced computer lab with latest technology
- Improved library resources and study spaces
- Better sports facilities for physical education

### New Teaching Staff
We are pleased to welcome several new qualified teachers to our team who bring fresh perspectives and expertise to our academic programs.

## Registration Information

Parents are reminded that registration is ongoing for new students, and all returning students should complete their registration process by the specified deadlines. Our administrative team is available to assist with any enrollment or academic questions.

### Important Dates
- Registration deadline: September 30, 2024
- Orientation for new students: October 5, 2024
- First term examinations: December 2-13, 2024

We look forward to a productive and successful academic year together!`,
      date: "2024-09-10",
      category: "Academics",
      author: "Principal's Office",
      readTime: "3 min read",
      featured: false
    }
  ];

  const currentIndex = allPosts.findIndex(p => p.id === parseInt(id || '') || p.id === id);
  const nextPost = allPosts[currentIndex + 1];
  const prevPost = allPosts[currentIndex - 1];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mb-6 pb-6 border-b">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-foreground leading-relaxed">
                  {post.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-primary mt-8 mb-4">
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-xl font-semibold text-primary mt-6 mb-3">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-6 mb-2 text-muted-foreground">
                          {paragraph.replace('- ', '')}
                        </li>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return (
                      <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation to Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevPost && (
              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Post
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`/blog/${prevPost.id}`} className="hover:text-primary transition-colors">
                      {prevPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="outline">{prevPost.category || 'Blog'}</Badge>
                    <span>{new Date(prevPost.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {nextPost && (
              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                    Next Post
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                  <CardTitle className="text-lg text-right">
                    <Link to={`/blog/${nextPost.id}`} className="hover:text-primary transition-colors">
                      {nextPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(nextPost.date).toLocaleDateString()}</span>
                    <Badge variant="outline">{nextPost.category || 'Blog'}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Back to Blog */}
          <div className="text-center mt-8">
            <Link to="/blog">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Blog Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;