import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

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

  const categories = ["All", "Academic Events", "Awards", "Campus Life", "Sports", "Cultural Activities"];

  const galleryItems = [
    {
      id: 1,
      src: gallery1,
      title: "School Leadership Team",
      category: "Academic Events",
      description: "Our dedicated management team committed to excellence in education"
    },
    {
      id: 2,
      src: gallery2,
      title: "Cultural Day Celebration",
      category: "Cultural Activities",
      description: "Students showcasing rich Nigerian heritage through traditional dances"
    },
    {
      id: 3,
      src: gallery3,
      title: "Student Fellowship",
      category: "Campus Life",
      description: "Students bonding and building lasting friendships"
    },
    {
      id: 4,
      src: achievement,
      title: "NECO Excellence Award Winner",
      category: "Awards",
      description: "Miss Adeyemo Emmanuella - Best Female SSCE Candidate in Nigeria"
    },
    {
      id: 5,
      src: awardCeremony,
      title: "LearnAfrica Excellence Awards 2024", 
      category: "Awards",
      description: "Students receiving recognition for outstanding academic performance"
    },
    {
      id: 6,
      src: culturalDance,
      title: "Traditional Dance Performance",
      category: "Cultural Activities",
      description: "Students performing traditional Nigerian dances during cultural week"
    },
    {
      id: 7,
      src: studentsGroup,
      title: "Class of 2025/2026",
      category: "Campus Life",
      description: "New students beginning their academic journey"
    },
    {
      id: 8,
      src: achievementStudents,
      title: "Academic Excellence Recognition",
      category: "Awards",
      description: "Students celebrating their outstanding academic achievements"
    },
    {
      id: 9,
      src: necoAwards,
      title: "NECO Awards Ceremony",
      category: "Awards",
      description: "Annual NECO awards recognizing exceptional student performance"
    },
    {
      id: 10,
      src: necoExcellence,
      title: "NECO Excellence Awards",
      category: "Awards",
      description: "Students receiving national recognition for academic excellence"
    },
    {
      id: 11,
      src: studentGroupBlue,
      title: "Students in Blue Uniforms",
      category: "Campus Life",
      description: "Students proudly wearing their school uniforms"
    },
    {
      id: 12,
      src: studentsPurple,
      title: "Students in Purple Uniforms",
      category: "Campus Life",
      description: "Students showcasing school spirit in their uniforms"
    },
    {
      id: 13,
      src: awardWinner,
      title: "Emmanuella - National Award Winner",
      category: "Awards",
      description: "Miss Adeyemo Emmanuella with her national award recognition"
    },
    {
      id: 14,
      src: necoExcellenceAwards,
      title: "NECO Excellence Awards Ceremony",
      category: "Awards",
      description: "Official ceremony recognizing academic excellence"
    },
    {
      id: 15,
      src: millionNaira,
      title: "Million Naira Achievement Fund",
      category: "Awards",
      description: "Launch of the million naira achievement fund for students"
    },
    {
      id: 16,
      src: certificatePresentation,
      title: "Certificate Presentation",
      category: "Academic Events",
      description: "Annual certificate presentation ceremony"
    },
    {
      id: 17,
      src: awardCeremonyOfficials,
      title: "Award Ceremony Officials",
      category: "Awards",
      description: "Distinguished officials at the award ceremony"
    },
    {
      id: 18,
      src: awardCeremonyPresentation,
      title: "Award Ceremony Presentation",
      category: "Awards",
      description: "Official presentation during the award ceremony"
    },
    {
      id: 19,
      src: officialAwardCeremony,
      title: "Official Award Ceremony",
      category: "Awards",
      description: "Annual official award ceremony celebrating achievements"
    }
  ];

  const filteredItems = galleryItems.filter(item => {
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
              <div className="flex justify-center">
                <img 
                  src={necoExcellenceAwards} 
                  alt="NECO Excellence Awards"
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
              placeholder="Search gallery..."
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id}
              className="group overflow-hidden cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              onClick={() => openLightbox(index)}
            >
              <div className="relative">
                <img 
                  src={item.src}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No images found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            <div className="max-w-4xl max-h-full w-full">
              <img
                src={filteredItems[selectedImage].src}
                alt={filteredItems[selectedImage].title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="text-center text-white mt-4 p-4">
                <Badge variant="secondary" className="mb-2">
                  {filteredItems[selectedImage].category}
                </Badge>
                <h3 className="text-xl font-semibold mb-2">{filteredItems[selectedImage].title}</h3>
                <p className="text-gray-300">{filteredItems[selectedImage].description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedImage + 1} of {filteredItems.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;