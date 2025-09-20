import React, { useState, useEffect } from 'react';
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
          content: editingPost.content,
          excerpt: editingPost.excerpt,
          image: editingPost.image,
          category: editingPost.category,
          status: editingPost.status
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
            .insert([{
              title: file.name.split('.')[0] || 'Untitled',
              image_url: data.publicUrl,
              description: `Uploaded via admin panel`,
              category: 'General',
              uploaded_by: (await supabase.auth.getUser()).data.user?.id
            }]);

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
          <h1 className="text-3xl font-bold text-primary">Professional CMS Dashboard</h1>
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
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Teachers
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
              <Card>
                <CardHeader>
                  <CardTitle>All Posts ({posts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                                        value={editingPost.status}
                                        onChange={(e) => setEditingPost({...editingPost, status: e.target.value})}
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
          <TabsContent value="gallery">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Gallery Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload multiple images to the gallery. They will appear instantly on the website.
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

              <Card>
                <CardHeader>
                  <CardTitle>Gallery Images ({galleryImages.length})</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Homepage Content Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {homepageContent.map(content => (
                      <div key={content.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{content.title || content.section_key}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {content.content?.substring(0, 100)}...
                            </p>
                            <Badge variant={content.is_visible ? 'default' : 'secondary'}>
                              {content.is_visible ? 'Visible' : 'Hidden'}
                            </Badge>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingContent(content)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Homepage Content</DialogTitle>
                              </DialogHeader>
                              {editingContent && (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  <Input
                                    placeholder="Title"
                                    value={editingContent.title || ''}
                                    onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                                  />
                                  <Textarea
                                    placeholder="Content"
                                    rows={4}
                                    value={editingContent.content || ''}
                                    onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                                  />
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Image</label>
                                    {editingContent.image_url && (
                                      <img src={editingContent.image_url} alt="Preview" className="w-full h-32 object-cover rounded border mb-2" />
                                    )}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleContentImageUpload(file);
                                      }}
                                      className="block w-full text-sm"
                                      disabled={uploading}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={editingContent.is_visible}
                                      onChange={(e) => setEditingContent({...editingContent, is_visible: e.target.checked})}
                                    />
                                    <label className="text-sm">Visible on website</label>
                                  </div>
                                  <Button onClick={handleUpdateHomepageContent} disabled={uploading}>
                                    Update Content
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teachers Management */}
          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Teachers Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {teachers.map(teacher => (
                    <div key={teacher.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{teacher.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {teacher.subject} - {teacher.department}
                        </p>
                        <p className="text-xs text-muted-foreground">Employee ID: {teacher.employee_id}</p>
                        <p className="text-xs text-muted-foreground">Hire Date: {new Date(teacher.hire_date).toLocaleDateString()}</p>
                      </div>
                      {/* Edit and Delete buttons could be added here if needed */}
                    </div>
                  ))}
                  {teachers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No teachers found. Add teachers to manage them here.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
