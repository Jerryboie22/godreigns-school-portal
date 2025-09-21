import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Image, FileText, Video, Trash2, Copy, Search, Grid, List } from "lucide-react";

interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

interface MediaLibraryProps {
  onFileSelect?: (file: MediaFile) => void;
  allowMultiple?: boolean;
  fileTypes?: string[];
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onFileSelect,
  allowMultiple = false,
  fileTypes = ['image/*', 'video/*', 'application/pdf']
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch media files: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cms-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('cms-media')
          .getPublicUrl(fileName);

        // Save to media library
        const { error: dbError } = await supabase
          .from('media_library')
          .insert([{
            filename: fileName,
            original_filename: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);
      await fetchMediaFiles();
      
      toast({
        title: "Success",
        description: `Uploaded ${files.length} file(s) successfully!`
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (file: MediaFile) => {
    if (!confirm(`Delete ${file.original_filename}?`)) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('cms-media')
        .remove([file.filename]);

      // Delete from database
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', file.id);

      if (error) throw error;

      await fetchMediaFiles();
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete file: " + error.message,
        variant: "destructive"
      });
    }
  };

  const updateFileDetails = async () => {
    if (!editingFile) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .update({
          alt_text: editingFile.alt_text,
          caption: editingFile.caption
        })
        .eq('id', editingFile.id);

      if (error) throw error;

      await fetchMediaFiles();
      setEditingFile(null);
      
      toast({
        title: "Success",
        description: "File details updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update file: " + error.message,
        variant: "destructive"
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Success",
      description: "URL copied to clipboard"
    });
  };

  const filteredFiles = mediaFiles.filter(file =>
    file.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="p-4">Loading media library...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold">Media Library</h3>
        
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="mb-2">
              <Button
                variant="outline"
                disabled={uploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              or drag and drop files here
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              accept={fileTypes.join(',')}
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:shadow-md transition-all">
              <CardContent className="p-2">
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-2 overflow-hidden">
                  {file.file_type.startsWith('image/') ? (
                    <img
                      src={file.file_url}
                      alt={file.alt_text || file.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">
                      {getFileIcon(file.file_type)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate" title={file.original_filename}>
                    {file.original_filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </p>
                </div>

                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onFileSelect && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFileSelect(file)}
                      className="h-6 px-2"
                    >
                      Select
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(file.file_url)}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFile(file)}
                    className="h-6 px-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteFile(file)}
                    className="h-6 px-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getFileIcon(file.file_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.original_filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {onFileSelect && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onFileSelect(file)}
                    >
                      Select
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(file.file_url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFile(file)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteFile(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
        </div>
      )}

      {/* Edit File Dialog */}
      <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File Details</DialogTitle>
          </DialogHeader>
          
          {editingFile && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Alt Text</label>
                <Input
                  value={editingFile.alt_text || ''}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    alt_text: e.target.value
                  })}
                  placeholder="Describe this image..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Caption</label>
                <Input
                  value={editingFile.caption || ''}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    caption: e.target.value
                  })}
                  placeholder="Add a caption..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={updateFileDetails}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingFile(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};