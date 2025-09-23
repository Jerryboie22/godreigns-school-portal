import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HomepageImage {
  id: string;
  section: string;
  title: string;
  description: string | null;
  image_url: string;
  alt_text: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ImageManager = () => {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<HomepageImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    description: '',
    alt_text: '',
    order_index: 0,
    is_active: true
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const sections = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'about', label: 'About Section' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'blog', label: 'Blog' },
    { value: 'achievement', label: 'Achievements' }
  ];

  useEffect(() => {
    fetchHomepageImages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('homepage-images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_images'
        },
        () => {
          fetchHomepageImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHomepageImages = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_images')
        .select('*')
        .order('section', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching homepage images:', error);
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('homepage-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = selectedImage?.image_url || '';

      if (uploadFile) {
        imageUrl = await handleFileUpload(uploadFile);
      }

      const imageData = {
        ...formData,
        image_url: imageUrl
      };

      if (selectedImage) {
        // Update existing image
        const { error } = await supabase
          .from('homepage_images')
          .update(imageData)
          .eq('id', selectedImage.id);

        if (error) throw error;
        toast.success('Image updated successfully');
      } else {
        // Create new image
        if (!imageUrl) {
          toast.error('Please select an image to upload');
          return;
        }

        const { error } = await supabase
          .from('homepage_images')
          .insert([imageData]);

        if (error) throw error;
        toast.success('Image added successfully');
      }

      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image: HomepageImage) => {
    setSelectedImage(image);
    setFormData({
      section: image.section,
      title: image.title,
      description: image.description || '',
      alt_text: image.alt_text,
      order_index: image.order_index,
      is_active: image.is_active
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('homepage_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setFormData({
      section: '',
      title: '',
      description: '',
      alt_text: '',
      order_index: 0,
      is_active: true
    });
    setUploadFile(null);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Homepage Images</h2>
          <p className="text-muted-foreground">Manage all images displayed on the homepage</p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
              <DialogDescription>
                {selectedImage ? 'Update the image details' : 'Add a new image to the homepage'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Select 
                    value={formData.section} 
                    onValueChange={(value) => setFormData({...formData, section: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          {section.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  value={formData.alt_text}
                  onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image File</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                {selectedImage && !uploadFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Saving...' : selectedImage ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={image.image_url}
                alt={image.alt_text}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={image.is_active ? "default" : "secondary"}>
                  {image.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                  <CardDescription>
                    {sections.find(s => s.value === image.section)?.label} - Order: {image.order_index}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {image.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {image.description}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(image)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first homepage image
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageManager;