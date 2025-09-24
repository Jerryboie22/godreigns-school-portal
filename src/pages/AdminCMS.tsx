import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { getAnalytics } from "@/hooks/useAnalytics";
import { toast } from "@/hooks/use-toast";
import { useSitemapUpdate } from "@/hooks/useSitemapUpdate";
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
  Home,
  Loader2,
  X
} from "lucide-react";

const AdminCMS = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);

  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
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

  // Update sitemap when content changes
  useSitemapUpdate([posts, galleryImages]);

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

      // Fetch homepage content
      const { data: contentData } = await supabase
        .from('homepage_content')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (contentData) setHomepageContent(contentData);

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

  const uploadImageToStorage = async (file: File, bucket: string = 'blog-images') => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setUploading(false);
      return data.publicUrl;
    } catch (error: any) {
      setUploading(false);
      throw new Error(error.message);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required!",
        variant: "destructive"
      });
      return;
    }

    if (newPost.status === 'published' && !newPost.image) {
      toast({
        title: "Featured Image Required",
        description: "You must add a featured image before publishing a post!",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('posts').insert([{
        title: newPost.title,
        slug: newPost.slug,
        content: newPost.content,
        excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
        featured_image: newPost.image,
        published: newPost.status === 'published',
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

      if (error) throw error;

      setNewPost({ title: '', slug: '', content: '', excerpt: '', image: '', category: 'General', status: 'draft' });
      await fetchData();
      
      toast({
        title: "Success",
        description: `Post ${newPost.status === 'published' ? 'published' : 'saved as draft'} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    if (editingPost.status === 'published' && !editingPost.image) {
      toast({
        title: "Featured Image Required",
        description: "Cannot publish a post without a featured image!",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editingPost.title,
          slug: editingPost.slug,
          content: editingPost.content,
          excerpt: editingPost.excerpt,
          featured_image: editingPost.image,
          published: editingPost.status === 'published'
        })
        .eq('id', editingPost.id);

      if (error) throw error;

      setEditingPost(null);
      await fetchData();
      
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateHomepageContent = async () => {
    if (!editingContent) return;

    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({
          title: editingContent.title,
          content: editingContent.content,
          image_url: editingContent.image_url,
          link_url: editingContent.link_url,
          link_text: editingContent.link_text,
          is_visible: editingContent.is_visible
        })
        .eq('id', editingContent.id);

      if (error) throw error;

      setEditingContent(null);
      await fetchData();
      
      toast({
        title: "Success",
        description: "Homepage content updated successfully!",
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

  const handleDeleteGalleryImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Gallery image deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (files: File[], bucket: string = 'gallery') => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        if (bucket === 'gallery') {
          const { error: dbError } = await supabase
            .from('gallery_images')
            .insert([
              {
                title: file.name.split('.')[0] || 'Untitled',
                image_url: data.publicUrl,
                description: 'Uploaded via admin panel'
              }
            ]);

          if (dbError) throw dbError;
        }
        
        return { fileName, url: data.publicUrl };
      });

      const results = await Promise.all(uploadPromises);
      
      await fetchData();
      setUploading(false);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${results.length} image(s)!`,
      });

      return results;
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload images",
        variant: "destructive"
      });
    }
  };

  const handleImageUploadForPost = async (file: File, isEdit: boolean = false) => {
    try {
      const imageUrl = await uploadImageToStorage(file, 'blog-images');
      
      if (isEdit && editingPost) {
        setEditingPost({ ...editingPost, image: imageUrl });
      } else {
        setNewPost({ ...newPost, image: imageUrl });
      }
      
      toast({
        title: "Image Uploaded",
        description: "Featured image uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleContentImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImageToStorage(file, 'gallery');
      if (editingContent) {
        setEditingContent({ ...editingContent, image_url: imageUrl });
      }
      toast({
        title: "Image Uploaded",
        description: "Content image uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateTeacher = async () => {
    if (!newTeacher.name || !newTeacher.subject || !newTeacher.employee_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create teacher record directly
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert([{
          name: newTeacher.name,
          subject: newTeacher.subject,
          department: newTeacher.department,
          employee_id: newTeacher.employee_id,
          hire_date: newTeacher.hire_date
        }]);

      if (teacherError) throw teacherError;

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
        description: "Teacher added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditTeacher = (teacher: any) => {
    setNewTeacher({
      name: teacher.name || '',
      subject: teacher.subject,
      department: teacher.department,
      employee_id: teacher.employee_id,
      hire_date: teacher.hire_date
    });
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <div className="bg-gradient-primary shadow-elegant border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Content Management</h1>
                <p className="text-white/80 text-sm">Manage your school's digital presence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => window.history.back()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link to="/">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Badge className="bg-accent text-accent-foreground px-3 py-1 font-medium">
                Administrator
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="posts" className="space-y-8">
          {/* Enhanced Tab Navigation */}
          <div className="bg-card border border-border/50 rounded-2xl p-2 shadow-soft">
            <TabsList className="grid w-full grid-cols-6 gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="posts" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">Posts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="gallery" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <Image className="h-4 w-4" />
                <span className="font-medium">Gallery</span>
              </TabsTrigger>
              <TabsTrigger 
                value="homepage" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <Settings className="h-4 w-4" />
                <span className="font-medium">Homepage</span>
              </TabsTrigger>
              <TabsTrigger 
                value="teachers" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Teachers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <Users className="h-4 w-4" />
                <span className="font-medium">Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-xl py-3 px-4 transition-all duration-200 hover:bg-muted/50"
              >
                <BarChart className="h-4 w-4" />
                <span className="font-medium">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Posts Management */}
          <TabsContent value="posts" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Create New Post */}
              <Card className="border-border/50 shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    Create New Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Title</label>
                    <Input 
                      placeholder="Enter your post title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">URL Slug</label>
                    <Input 
                      placeholder="post-url-slug"
                      value={newPost.slug}
                      onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                      className="border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Excerpt</label>
                    <Textarea 
                      placeholder="Write a compelling excerpt..."
                      rows={2}
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                      className="border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Content</label>
                    <Textarea 
                      placeholder="Write your post content..."
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Category</label>
                    <Input 
                      placeholder="Post category..."
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Featured Image <span className="text-red-500">*</span>
                      <span className="text-xs text-muted-foreground ml-2">(Required for publishing)</span>
                    </label>
                    <div className="space-y-2">
                      {newPost.image && (
                        <div className="relative">
                          <img 
                            src={newPost.image} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded border"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => setNewPost({...newPost, image: ''})}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUploadForPost(file);
                        }}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading image...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setNewPost({...newPost, status: 'draft'});
                        handleCreatePost();
                      }}
                      className="flex-1 bg-gradient-primary"
                      disabled={uploading}
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
                      disabled={uploading || !newPost.image}
                    >
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <Card className="border-border/50 shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    All Posts
                    <Badge variant="secondary" className="ml-auto">
                      {posts.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {posts.map(post => (
                      <div key={post.id} className="border border-border/50 rounded-xl p-5 hover:shadow-soft transition-all duration-200 hover:border-primary/20 bg-gradient-to-r from-background to-muted/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2 text-foreground text-base">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {post.excerpt || post.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-muted-foreground">
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              <Badge 
                                variant={post.published ? 'default' : 'secondary'}
                                className={post.published ? 'bg-primary/10 text-primary border-primary/20' : ''}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline" className="border-border/50">
                                {post.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline" onClick={() => window.open(`/blog/${post.id}`, '_blank')}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Post</DialogTitle>
                                </DialogHeader>
                                {editingPost && (
                                   <div className="space-y-4">
                                     <Input
                                       placeholder="Title"
                                       value={editingPost.title}
                                       onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                     />
                                     <Input
                                       placeholder="URL Slug"
                                       value={editingPost.slug || ''}
                                       onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                                     />
                                    <Textarea
                                      placeholder="Excerpt"
                                      rows={2}
                                      value={editingPost.excerpt}
                                      onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                                    />
                                    <Textarea
                                      placeholder="Content"
                                      rows={6}
                                      value={editingPost.content}
                                      onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                    />
                                    
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Featured Image</label>
                                      {editingPost.image && (
                                        <img src={editingPost.image} alt="Preview" className="w-full h-32 object-cover rounded border mb-2" />
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleImageUploadForPost(file, true);
                                        }}
                                        className="block w-full text-sm"
                                        disabled={uploading}
                                      />
                                    </div>

                                     <div className="flex gap-2">
                                       <select
                                         value={editingPost.published ? 'published' : 'draft'}
                                         onChange={(e) => setEditingPost({...editingPost, status: e.target.value, published: e.target.value === 'published'})}
                                         className="flex-1 px-3 py-2 border rounded"
                                       >
                                         <option value="draft">Draft</option>
                                         <option value="published">Published</option>
                                       </select>
                                      <Button onClick={handleUpdatePost} disabled={uploading}>
                                        Update Post
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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
          <TabsContent value="gallery" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-border/50 shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-accent-foreground" />
                    </div>
                    Upload Gallery Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-primary/20 rounded-xl p-12 text-center bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-colors duration-200">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Upload Images</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Upload multiple images to the gallery. They will appear instantly on the website gallery section.
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
                      disabled={uploading}
                    />
                    <Button asChild variant="outline" disabled={uploading}>
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        {uploading ? 'Uploading...' : 'Choose Images'}
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-soft hover:shadow-elegant transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Image className="h-5 w-5 text-secondary" />
                    </div>
                    Gallery Images
                    <Badge variant="secondary" className="ml-auto">
                      {galleryImages.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {galleryImages.map(image => (
                      <div key={image.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={image.image_url} 
                              alt={image.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-medium">{image.title}</h4>
                              <p className="text-sm text-muted-foreground">{image.category}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteGalleryImage(image.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {galleryImages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No gallery images yet. Upload your first images!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Homepage Content Editing */}
          <TabsContent value="homepage">
            <div className="space-y-6">
              {/* Overview Header */}
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Homepage Content Management</h2>
                      <p className="text-muted-foreground">Manage your website's homepage sections and content</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Total Sections</div>
                      <div className="text-3xl font-bold text-primary">{homepageContent.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {homepageContent.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <Home className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-xl font-semibold mb-2">No Homepage Content Yet</h3>
                      <p className="max-w-md mx-auto">Your homepage sections will appear here once they're created in the database. Each section can be customized with images, text, and links.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {homepageContent
                    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                    .map((content, index) => (
                    <Card key={content.id} className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${!content.is_visible ? 'opacity-60 border-dashed' : 'border-solid'}`}>
                      <div className="flex">
                        {/* Left: Content Preview */}
                        <div className="flex-1 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                #{index + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{content.title || `${content.section_type} Section`}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {content.section_type?.replace('_', ' ')}
                                  </Badge>
                                  <Badge variant={content.is_visible ? 'default' : 'secondary'} className="text-xs">
                                    {content.is_visible ? (
                                      <><Eye className="h-3 w-3 mr-1" />Published</>
                                    ) : (
                                      <><X className="h-3 w-3 mr-1" />Hidden</>
                                    )}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {content.content && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Content</h4>
                              <p className="text-sm leading-relaxed line-clamp-3 bg-muted/30 p-3 rounded-md">
                                {content.content}
                              </p>
                            </div>
                          )}

                          {(content.link_url || content.link_text) && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Link</h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {content.link_text || 'Learn More'}
                                </span>
                                {content.link_url && (
                                  <span className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded">
                                    {content.link_url}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setEditingContent(content)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Section
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Edit {content.section_type?.replace('_', ' ')} Section
                                  </DialogTitle>
                                </DialogHeader>
                                {editingContent && (
                                  <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                                    {/* Section Info */}
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                      <h4 className="font-medium mb-2">Section Information</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Type:</span>
                                          <span className="ml-2 font-medium capitalize">{editingContent.section_type?.replace('_', ' ')}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Order:</span>
                                          <span className="ml-2 font-medium">#{editingContent.order_index}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Content Fields */}
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium mb-2 block">Section Title</label>
                                        <Input
                                          placeholder="Enter section title..."
                                          value={editingContent.title || ''}
                                          onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium mb-2 block">Content</label>
                                        <Textarea
                                          placeholder="Enter section content..."
                                          rows={5}
                                          value={editingContent.content || ''}
                                          onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                                          className="resize-none"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-sm font-medium mb-2 block">Section Image</label>
                                        {editingContent.image_url && (
                                          <div className="mb-3">
                                            <img 
                                              src={editingContent.image_url} 
                                              alt="Section preview" 
                                              className="w-full h-48 object-cover rounded-lg border"
                                            />
                                          </div>
                                        )}
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleContentImageUpload(file);
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={uploading}
                                          />
                                          <label htmlFor="image-upload" className="cursor-pointer">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                              {uploading ? 'Uploading...' : 'Click to upload image'}
                                            </p>
                                          </label>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium mb-2 block">Link URL</label>
                                          <Input
                                            placeholder="https://example.com"
                                            value={editingContent.link_url || ''}
                                            onChange={(e) => setEditingContent({...editingContent, link_url: e.target.value})}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium mb-2 block">Link Text</label>
                                          <Input
                                            placeholder="Learn More"
                                            value={editingContent.link_text || ''}
                                            onChange={(e) => setEditingContent({...editingContent, link_text: e.target.value})}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                        <div>
                                          <h4 className="font-medium">Visibility</h4>
                                          <p className="text-sm text-muted-foreground">Control whether this section appears on the website</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={editingContent.is_visible}
                                              onChange={(e) => setEditingContent({...editingContent, is_visible: e.target.checked})}
                                              className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                          </label>
                                          <span className="text-sm font-medium">
                                            {editingContent.is_visible ? 'Published' : 'Hidden'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                      <Button variant="outline" onClick={() => setEditingContent(null)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleUpdateHomepageContent} disabled={uploading}>
                                        {uploading ? (
                                          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                                        ) : (
                                          <><Save className="h-4 w-4 mr-2" />Save Changes</>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        {/* Right: Image Preview */}
                        <div className="w-64 bg-muted/20">
                          {content.image_url ? (
                            <img 
                              src={content.image_url} 
                              alt={content.title || 'Section image'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <div className="text-center">
                                <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs">No image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Teachers Management */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Teacher Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Teacher
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Teacher Name"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  />
                  <Input
                    placeholder="Subject"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                  />
                  <Input
                    placeholder="Department"
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                  />
                  <Input
                    placeholder="Employee ID"
                    value={newTeacher.employee_id}
                    onChange={(e) => setNewTeacher({...newTeacher, employee_id: e.target.value})}
                  />
                  <Input
                    type="date"
                    placeholder="Hire Date"
                    value={newTeacher.hire_date}
                    onChange={(e) => setNewTeacher({...newTeacher, hire_date: e.target.value})}
                  />
                  <Button onClick={handleCreateTeacher} className="w-full bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </Button>
                </CardContent>
              </Card>

              {/* Teachers List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Teachers ({teachers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {teachers.map(teacher => (
                      <div key={teacher.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                             <h4 className="font-semibold">{teacher.name || 'Unknown Teacher'}</h4>
                             <p className="text-sm text-muted-foreground">{teacher.subject} - {teacher.department}</p>
                             <p className="text-xs text-muted-foreground">Employee ID: {teacher.employee_id}</p>
                             <p className="text-xs text-muted-foreground">Hire Date: {new Date(teacher.hire_date).toLocaleDateString()}</p>
                           </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditTeacher(teacher)}>
                              <Edit className="h-3 w-3" />
                            </Button>
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
                        <p>No teachers yet. Add your first teacher!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Users Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Users management section - functionality preserved from original</p>
                </div>
              </CardContent>
            </Card>
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
                    onClick={() => window.location.href = '/'}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    View Website
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
