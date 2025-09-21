import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { getAnalytics } from "@/hooks/useAnalytics";
import { toast } from "@/hooks/use-toast";
import { useSitemapUpdate } from "@/hooks/useSitemapUpdate";
import { MediaLibrary } from "@/components/MediaLibrary";
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
  X,
  Menu,
  Globe,
  Palette,
  Database,
  Shield,
  Monitor
} from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order_index: number;
  is_active: boolean;
  parent_id?: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published: boolean;
  template: string;
  created_at: string;
  updated_at: string;
}

const FullAdminCMS = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);

  // New state for CMS features
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [editingNav, setEditingNav] = useState<NavigationItem | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft'
  });

  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_published: true,
    template: 'default'
  });

  const [newNavItem, setNewNavItem] = useState({
    label: '',
    url: '',
    order_index: 0,
    is_active: true,
    parent_id: ''
  });

  // Update sitemap when content changes
  useSitemapUpdate([posts, galleryImages, pages]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch existing data
      const [postsRes, galleryRes, homepageRes, analyticsData] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
        supabase.from('homepage_content').select('*').order('order_index', { ascending: true }),
        getAnalytics()
      ]);

      // Fetch new CMS data
      const [settingsRes, navRes, pagesRes, teachersRes] = await Promise.all([
        supabase.from('site_settings').select('*').order('key'),
        supabase.from('navigation_menu').select('*').order('order_index'),
        supabase.from('pages').select('*').order('created_at', { ascending: false }),
        supabase.from('teachers').select('*').order('created_at', { ascending: false })
      ]);

      if (postsRes.data) setPosts(postsRes.data);
      if (galleryRes.data) setGalleryImages(galleryRes.data);
      if (homepageRes.data) setHomepageContent(homepageRes.data);
      if (settingsRes.data) setSiteSettings(settingsRes.data);
      if (navRes.data) setNavigationItems(navRes.data);
      if (pagesRes.data) setPages(pagesRes.data);
      if (teachersRes.data) setTeachers(teachersRes.data);
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

  // Site Settings Functions
  const updateSiteSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;

      setSiteSettings(settings => 
        settings.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        )
      );

      toast({
        title: "Success",
        description: "Setting updated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Navigation Functions
  const createNavItem = async () => {
    if (!newNavItem.label || !newNavItem.url) return;

    try {
      const { error } = await supabase
        .from('navigation_menu')
        .insert([{
          ...newNavItem,
          parent_id: newNavItem.parent_id || null
        }]);

      if (error) throw error;

      setNewNavItem({
        label: '',
        url: '',
        order_index: 0,
        is_active: true,
        parent_id: ''
      });

      await fetchAllData();
      toast({
        title: "Success",
        description: "Navigation item created!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateNavItem = async () => {
    if (!editingNav) return;

    try {
      const { error } = await supabase
        .from('navigation_menu')
        .update({
          label: editingNav.label,
          url: editingNav.url,
          order_index: editingNav.order_index,
          is_active: editingNav.is_active,
          parent_id: editingNav.parent_id || null
        })
        .eq('id', editingNav.id);

      if (error) throw error;

      setEditingNav(null);
      await fetchAllData();
      toast({
        title: "Success",
        description: "Navigation updated!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteNavItem = async (id: string) => {
    if (!confirm('Delete this navigation item?')) return;

    try {
      const { error } = await supabase
        .from('navigation_menu')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAllData();
      toast({
        title: "Success",
        description: "Navigation item deleted!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Page Functions
  const createPage = async () => {
    if (!newPage.title || !newPage.slug || !newPage.content) {
      toast({
        title: "Validation Error",
        description: "Title, slug, and content are required!",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pages')
        .insert([newPage]);

      if (error) throw error;

      setNewPage({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_published: true,
        template: 'default'
      });

      await fetchAllData();
      toast({
        title: "Success",
        description: "Page created successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updatePage = async () => {
    if (!editingPage) return;

    try {
      const { error } = await supabase
        .from('pages')
        .update({
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content,
          excerpt: editingPage.excerpt,
          featured_image: editingPage.featured_image,
          meta_title: editingPage.meta_title,
          meta_description: editingPage.meta_description,
          meta_keywords: editingPage.meta_keywords,
          is_published: editingPage.is_published,
          template: editingPage.template
        })
        .eq('id', editingPage.id);

      if (error) throw error;

      setEditingPage(null);
      await fetchAllData();
      toast({
        title: "Success",
        description: "Page updated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm('Delete this page?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAllData();
      toast({
        title: "Success",
        description: "Page deleted successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Post management, teachers, gallery, analytics, homepage content management would be implemented similarly here...

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <h1 className="text-2xl font-bold">WordPress-Style CMS</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowMediaLibrary(true)}>
                <Image className="h-4 w-4 mr-2" />
                Media Library
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
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

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {posts.filter(p => p.published).length} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pages.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {pages.filter(p => p.is_published).length} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{galleryImages.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews || 0}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => setActiveTab('posts')} className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    New Post
                  </Button>
                  <Button onClick={() => setActiveTab('pages')} variant="outline" className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    New Page
                  </Button>
                  <Button onClick={() => setShowMediaLibrary(true)} variant="outline" className="h-20 flex-col">
                    <Upload className="h-6 w-6 mb-2" />
                    Upload Media
                  </Button>
                  <Button onClick={() => setActiveTab('settings')} variant="outline" className="h-20 flex-col">
                    <Settings className="h-6 w-6 mb-2" />
                    Site Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your site's global settings and configuration
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {siteSettings.map((setting) => (
                    <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                      <div>
                        <label className="font-medium">{setting.key.replace(/_/g, ' ').toUpperCase()}</label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Input
                        value={setting.value || ''}
                        onChange={(e) => setSiteSettings(settings =>
                          settings.map(s => s.id === setting.id ? {...s, value: e.target.value} : s)
                        )}
                        placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                      />
                      <Button
                        onClick={() => updateSiteSetting(setting.key, setting.value || '')}
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Navigation Item */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Navigation Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Label"
                    value={newNavItem.label}
                    onChange={(e) => setNewNavItem({...newNavItem, label: e.target.value})}
                  />
                  <Input
                    placeholder="URL"
                    value={newNavItem.url}
                    onChange={(e) => setNewNavItem({...newNavItem, url: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Order"
                    value={newNavItem.order_index}
                    onChange={(e) => setNewNavItem({...newNavItem, order_index: parseInt(e.target.value) || 0})}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newNavItem.is_active}
                      onCheckedChange={(checked) => setNewNavItem({...newNavItem, is_active: checked})}
                    />
                    <span>Active</span>
                  </div>
                  <Button onClick={createNavItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Navigation Item
                  </Button>
                </CardContent>
              </Card>

              {/* Navigation Items List */}
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Menu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNav(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteNavItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pages</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Page
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Page</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Page Title"
                        value={newPage.title}
                        onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                      />
                      <Input
                        placeholder="URL Slug"
                        value={newPage.slug}
                        onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                      />
                    </div>
                    
                    <Textarea
                      placeholder="Page Content"
                      value={newPage.content}
                      onChange={(e) => setNewPage({...newPage, content: e.target.value})}
                      rows={10}
                    />
                    
                    <Textarea
                      placeholder="Excerpt (optional)"
                      value={newPage.excerpt}
                      onChange={(e) => setNewPage({...newPage, excerpt: e.target.value})}
                      rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Meta Title"
                        value={newPage.meta_title}
                        onChange={(e) => setNewPage({...newPage, meta_title: e.target.value})}
                      />
                      <Input
                        placeholder="Meta Description"
                        value={newPage.meta_description}
                        onChange={(e) => setNewPage({...newPage, meta_description: e.target.value})}
                      />
                      <Input
                        placeholder="Meta Keywords"
                        value={newPage.meta_keywords}
                        onChange={(e) => setNewPage({...newPage, meta_keywords: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newPage.is_published}
                          onCheckedChange={(checked) => setNewPage({...newPage, is_published: checked})}
                        />
                        <span>Published</span>
                      </div>
                      
                      <Select value={newPage.template} onValueChange={(value) => setNewPage({...newPage, template: value})}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="full-width">Full Width</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={createPage} className="w-full">
                      Create Page
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{page.title}</p>
                            {page.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {page.excerpt}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            /{page.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={page.is_published ? "default" : "secondary"}>
                            {page.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{page.template}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(page.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPage(page)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deletePage(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs for posts, gallery, users, analytics would be implemented here */}
        </Tabs>
      </div>

      {/* Media Library Modal */}
      <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <MediaLibrary />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modals for settings, navigation, pages, posts, etc. would go here */}
    </div>
  );
};

export default FullAdminCMS;
