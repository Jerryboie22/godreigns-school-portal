import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "@/hooks/use-toast";

// Fallback images
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import achievement from "@/assets/achievement.jpg";
import awardCeremony from "@/assets/award-ceremony.jpg";
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

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);

  useAnalytics();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
    };
    checkAdminStatus();
  }, []);

  const categories = ["All", "Academic Events", "Awards", "Campus Life", "Sports", "Cultural Activities", "General"];

  useEffect(() => {
    fetchGalleryImages();
    
    // Set up real-time subscription for gallery images
    const channel = supabase
      .channel('gallery-images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_images'
        },
        () => {
          fetchGalleryImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery images:', error);
        // Use fallback images if database fetch fails
        setGalleryImages(fallbackGalleryItems);
      } else if (data && data.length > 0) {
        // Format the data to match expected structure
        const formattedData = data.map(item => ({
          id: item.id,
          src: item.image_url,
          image_url: item.image_url,
          title: item.title,
          description: item.description || ""
        }));
        setGalleryImages(formattedData);
      } else {
        // Use fallback if no data in database
        setGalleryImages(fallbackGalleryItems);
      }
    } catch (error) {
      console.error('Error in fetchGalleryImages:', error);
      setGalleryImages(fallbackGalleryItems);
    } finally {
      setLoading(false);
    }
  };

  // Fallback gallery items
  const fallbackGalleryItems = [
    {
      id: 1,
      src: gallery1,
      image_url: gallery1,
      title: "Award Ceremony Moment",
      category: "Awards",
      description: "Students celebrating their achievements"
    },
    {
      id: 2,
      src: gallery2,
      image_url: gallery2,
      title: "Academic Excellence",
      category: "Academic Events",
      description: "Recognition of outstanding academic performance"
    },
    {
      id: 3,
      src: gallery3,
      image_url: gallery3,
      title: "School Assembly",
      category: "Campus Life",
      description: "Daily morning assembly session"
    },
    {
      id: 4,
      src: achievement,
      image_url: achievement,
      title: "Achievement Awards",
      category: "Awards",
      description: "Annual achievement recognition ceremony"
    },
    {
      id: 5,
      src: awardCeremony,
      image_url: awardCeremony,
      title: "Award Ceremony",
      category: "Awards",
      description: "Special recognition for academic excellence"
    },
    {
      id: 6,
      src: culturalDance,
      image_url: culturalDance,
      title: "Cultural Dance Performance",
      category: "Cultural Activities",
      description: "Traditional dance performance by students"
    },
    {
      id: 7,
      src: studentsGroup,
      image_url: studentsGroup,
      title: "Students Group Photo",
      category: "Campus Life",
      description: "Class group photo session"
    },
    {
      id: 8,
      src: achievementStudents,
      image_url: achievementStudents,
      title: "Achievement Students",
      category: "Awards",
      description: "Top performing students of the year"
    },
    {
      id: 9,
      src: necoAwards,
      image_url: necoAwards,
      title: "NECO Awards",
      category: "Academic Events",
      description: "NECO examination excellence awards"
    },
    {
      id: 10,
      src: necoExcellence,
      image_url: necoExcellence,
      title: "NECO Excellence",
      category: "Academic Events",
      description: "Outstanding performance in NECO examinations"
    },
    {
      id: 11,
      src: studentGroupBlue,
      image_url: studentGroupBlue,
      title: "Students in Blue Uniforms",
      category: "Campus Life",
      description: "Students in their daily school uniforms"
    },
    {
      id: 12,
      src: studentsPurple,
      image_url: studentsPurple,
      title: "Students in Purple Uniforms",
      category: "Campus Life",
      description: "Special uniform day celebration"
    },
    {
      id: 13,
      src: awardWinner,
      image_url: awardWinner,
      title: "Award Winner - Emmanuella",
      category: "Awards",
      description: "Outstanding student achievement recognition"
    },
    {
      id: 14,
      src: necoExcellenceAwards,
      image_url: necoExcellenceAwards,
      title: "NECO Excellence Awards Ceremony",
      category: "Academic Events",
      description: "Annual NECO excellence awards ceremony"
    },
    {
      id: 15,
      src: millionNaira,
      image_url: millionNaira,
      title: "Million Naira Achievement Fund",
      category: "Awards",
      description: "Launch of the million naira achievement fund for students"
    },
    {
      id: 16,
      src: certificatePresentation,
      image_url: certificatePresentation,
      title: "Certificate Presentation",
      category: "Academic Events",
      description: "Annual certificate presentation ceremony"
    },
    {
      id: 17,
      src: awardCeremonyOfficials,
      image_url: awardCeremonyOfficials,
      title: "Award Ceremony Officials",
      category: "Awards",
      description: "Distinguished officials at the award ceremony"
    },
    {
      id: 18,
      src: awardCeremonyPresentation,
      image_url: awardCeremonyPresentation,
      title: "Award Ceremony Presentation",
      category: "Awards",
      description: "Official presentation during the award ceremony"
    },
    {
      id: 19,
      src: officialAwardCeremony,
      image_url: officialAwardCeremony,
      title: "Official Award Ceremony",
      category: "Awards",
      description: "Annual official award ceremony celebrating achievements"
    }
  ];

  // Use database images if available, otherwise use fallback
  const allGalleryItems = galleryImages.length > 0 ? galleryImages : fallbackGalleryItems;

  const filteredItems = allGalleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  };

  // Add event listener for keyboard navigation
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('gallery_images')
        .insert([
          {
            title: file.name.replace(/\.[^/.]+$/, ""),
            image_url: publicUrl,
            category: 'General',
            description: `Uploaded image: ${file.name}`
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    });

    try {
      const newImages = await Promise.all(uploadPromises);
      fetchGalleryImages(); // Refresh the gallery
      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      fetchGalleryImages(); // Refresh the gallery
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleEditImage = async (imageData: any) => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .update({
          title: imageData.title,
          category: imageData.category,
          description: imageData.description
        })
        .eq('id', imageData.id)
        .select();

      if (error) throw error;

      fetchGalleryImages(); // Refresh the gallery
      setEditingImage(null);
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Achievement Theme */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">School Gallery</h1>
                <p className="text-xl text-white/90 mb-6">Capturing moments of excellence and growth</p>
                <p className="text-white/80">Celebrating achievements, culture, and academic excellence</p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{allGalleryItems.length}</div>
                      <div className="text-sm text-white/80">Images in Gallery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Admin Upload Section */}
          {isAdmin && (
            <Card className="mb-8 bg-white/95 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Gallery Management</h3>
                  <div className="flex gap-2">
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
                    <Button asChild variant="outline" size="sm" disabled={uploading}>
                      <label htmlFor="gallery-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </label>
                    </Button>
                  </div>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Uploading images...
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="group cursor-pointer overflow-hidden hover:shadow-elegant transition-all duration-300 transform hover:scale-105 relative"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    loading="lazy"
                    src={item.image_url || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Admin Controls */}
                  {isAdmin && item.id && !item.src?.includes('/assets/') && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(item);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(item.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl text-muted-foreground/30 mb-4">📸</div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No images found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Lightbox */}
          {selectedImage !== null && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
              >
                <X size={32} />
              </button>
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
                disabled={filteredItems.length <= 1}
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-60"
                disabled={filteredItems.length <= 1}
              >
                <ChevronRight size={32} />
              </button>

              <div className="max-w-4xl max-h-full flex flex-col items-center">
                <img
                  src={filteredItems[selectedImage].image_url || filteredItems[selectedImage].src}
                  alt={filteredItems[selectedImage].title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                <div className="text-white text-center mt-4">
                  <h3 className="text-xl font-semibold mb-2">{filteredItems[selectedImage].title}</h3>
                  <p className="text-gray-300 mb-2">{filteredItems[selectedImage].description}</p>
                  <Badge variant="secondary">{filteredItems[selectedImage].category}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Edit Image Modal */}
          {editingImage && (
            <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <img 
                      src={editingImage.image_url || editingImage.src} 
                      alt={editingImage.title}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <Input
                    placeholder="Image title"
                    value={editingImage.title}
                    onChange={(e) => setEditingImage({...editingImage, title: e.target.value})}
                  />
                  <select
                    value={editingImage.category}
                    onChange={(e) => setEditingImage({...editingImage, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Description"
                    value={editingImage.description || ''}
                    onChange={(e) => setEditingImage({...editingImage, description: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditImage(editingImage)} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingImage(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;