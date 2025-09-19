import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { getAnalytics } from "@/hooks/useAnalytics";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Image, 
  Calendar, 
  Users,
  BarChart,
  Settings,
  Upload,
  Eye,
  Save,
  GraduationCap,
  ArrowLeft,
  Home
} from "lucide-react";

const AdminCMS = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'General',
    status: 'draft'
  });

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: '',
    department: '',
    employee_id: '',
    hire_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsData) setPosts(postsData);

      // Fetch gallery images count
      const { data: galleryData } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (galleryData) setGalleryImages(galleryData);

      // Fetch teachers
      const { data: teachersData } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (teachersData) setTeachers(teachersData);

      // Fetch analytics
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (newPost.title && newPost.content) {
      try {
        const { error } = await supabase.from('posts').insert([{
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
          image: newPost.image,
          category: newPost.category,
          status: newPost.status,
          author_id: (await supabase.auth.getUser()).data.user?.id
        }]);

        if (error) throw error;

        setNewPost({ title: '', content: '', excerpt: '', image: '', category: 'General', status: 'draft' });
        await fetchData();
        
        toast({
          title: "Success",
          description: "Post created successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handlePublishPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'published' })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Post published successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateTeacher = async () => {
    if (newTeacher.name && newTeacher.subject && newTeacher.employee_id) {
      try {
        const { error } = await supabase.from('teachers').insert([{
          ...newTeacher,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

        if (error) throw error;

        setNewTeacher({
          name: '',
          subject: '',
          department: '',
          employee_id: '',
          hire_date: new Date().toISOString().split('T')[0]
        });
        await fetchData();
        
        toast({
          title: "Success",
          description: "Teacher added successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Teacher removed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(`gallery/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(`gallery/${fileName}`);

        // Insert into gallery_images table
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{
            title: file.name.split('.')[0] || 'Untitled',
            image_url: data.publicUrl,
            description: `Uploaded via admin panel`,
            category: 'General',
            uploaded_by: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (dbError) throw dbError;
        
        return { fileName, url: data.publicUrl };
      });

      const results = await Promise.all(uploadPromises);
      
      await fetchData(); // Refresh data
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${results.length} image(s) to gallery!`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload images",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading CMS Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin CMS Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Badge className="bg-primary text-white">Administrator</Badge>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Posts Management */}
          <TabsContent value="posts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create New Post */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input 
                      placeholder="Post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Excerpt</label>
                    <Textarea 
                      placeholder="Short description..."
                      rows={2}
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea 
                      placeholder="Post content..."
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input 
                      placeholder="Post category..."
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                    <Input 
                      placeholder="Image URL..."
                      value={newPost.image}
                      onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreatePost}
                      className="flex-1 bg-gradient-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={() => {
                        setNewPost({...newPost, status: 'published'});
                        handleCreatePost();
                      }}
                      variant="outline"
                    >
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Posts ({posts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.excerpt || post.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{new Date(post.created_at).toLocaleDateString()}</span>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {post.status === 'draft' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePublishPost(post.id)}
                                className="text-green-600"
                              >
                                Publish
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No posts yet. Create your first blog post!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="gallery">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Gallery Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload images to the gallery. Drag and drop or click to select files.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Gallery Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bulk Image Upload</label>
                    <div className="border border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileUpload(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                        id="bulk-upload"
                      />
                      <Button asChild variant="outline" className="w-full">
                        <label htmlFor="bulk-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Select Multiple Images
                        </label>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teachers Management */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add New Teacher */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Teacher
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input 
                      placeholder="Teacher's full name..."
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input 
                      placeholder="Subject taught..."
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Input 
                      placeholder="Department..."
                      value={newTeacher.department}
                      onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Employee ID</label>
                    <Input 
                      placeholder="Employee ID..."
                      value={newTeacher.employee_id}
                      onChange={(e) => setNewTeacher({...newTeacher, employee_id: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Hire Date</label>
                    <Input 
                      type="date"
                      value={newTeacher.hire_date}
                      onChange={(e) => setNewTeacher({...newTeacher, hire_date: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateTeacher}
                    className="w-full bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </CardContent>
              </Card>

              {/* Teachers List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Teachers ({teachers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teachers.map(teacher => (
                      <div key={teacher.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{teacher.name || 'N/A'}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {teacher.subject} • {teacher.department || 'General'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>ID: {teacher.employee_id}</span>
                              <span>Hired: {new Date(teacher.hire_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {teachers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No teachers added yet. Add your first teacher!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Management */}
          <TabsContent value="events">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Event title..." />
                  <Textarea placeholder="Event description..." rows={4} />
                  <Input type="date" placeholder="Event date" />
                  <Input placeholder="Event location..." />
                  <Button className="w-full">Create Event</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Academic Session Opening</h4>
                      <p className="text-sm text-muted-foreground">September 15, 2025</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Parent-Teacher Meeting</h4>
                      <p className="text-sm text-muted-foreground">October 10, 2025</p>
                    </div>
                    <Button variant="outline" className="w-full">View All Events</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input placeholder="Search users..." className="flex-1" />
                    <Button>Search</Button>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">Admin User</p>
                        <p className="text-sm text-muted-foreground">admin@ogrcschool.com</p>
                      </div>
                      <Badge>Administrator</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">John Teacher</p>
                        <p className="text-sm text-muted-foreground">john@ogrcschool.com</p>
                      </div>
                      <Badge variant="secondary">Teacher</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Portal Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/portal/admin'}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Admin Portal
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/portal/staff'}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Staff Portal
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/portals'}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    All Portals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Live Site Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Blog Posts</span>
                      <span className="font-bold">{posts.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Published Posts</span>
                      <span className="font-bold">{posts.filter(p => p.status === 'published').length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Gallery Images</span>
                      <span className="font-bold">{galleryImages.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Teachers</span>
                      <span className="font-bold">{teachers.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Page Views</span>
                      <span className="font-bold">{analytics.totalViews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Students</span>
                      <span className="font-bold">{analytics.totalStudents || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Teachers</span>
                      <span className="font-bold">{analytics.totalTeachers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Views</span>
                      <span className="font-bold">{analytics.totalViews || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/blog'}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Blog
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    View Gallery
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Contact Messages
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminCMS;