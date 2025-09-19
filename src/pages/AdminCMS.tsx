import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  GraduationCap
} from "lucide-react";

const AdminCMS = () => {
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: "NECO Excellence Awards 2024", 
      content: "Miss Adeyemo Emmanuella Adedamola receives national recognition...", 
      status: "published",
      date: "2024-09-15",
      image: "/assets/neco-excellence-awards.jpg"
    },
    { 
      id: 2, 
      title: "Academic Session 2025/2026 Opens", 
      content: "Welcome to the new academic session with new opportunities...", 
      status: "draft",
      date: "2025-09-01",
      image: "/assets/students-group.jpg"
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
    status: 'draft'
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        id: Date.now(),
        ...newPost,
        date: new Date().toISOString().split('T')[0]
      };
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '', image: '', status: 'draft' });
      // Here you would typically save to your database
      alert('Post created successfully!');
    }
  };

  const handlePublishPost = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: 'published' } : post
    ));
    alert('Post published successfully!');
  };

  const handleEditPost = (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setNewPost({
        title: post.title,
        content: post.content,
        image: post.image,
        status: post.status
      });
      handleDeletePost(id);
    }
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin CMS Dashboard</h1>
          <Badge className="bg-primary text-white">Administrator</Badge>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
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
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea 
                      placeholder="Post content..."
                      rows={6}
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
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
                  <CardTitle>All Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.content.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{post.date}</span>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditPost(post.id)}
                            >
                              <Edit className="h-3 w-3" />
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Upload new images to gallery</p>
                    <Button>Choose Files</Button>
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
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Image Upload
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Gallery Settings
                  </Button>
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
                    Site Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Total Blog Posts</span>
                      <span className="font-bold">23</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Gallery Images</span>
                      <span className="font-bold">145</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Page Views (Month)</span>
                      <span className="font-bold">2,847</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Active Users</span>
                      <span className="font-bold">156</span>
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
                    View Website Blog
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/gallery'}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    View Website Gallery
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Contact Messages
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/portal/admin'}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Portal
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