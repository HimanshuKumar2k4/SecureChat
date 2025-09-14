import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Upload, File, Image, Video, Music } from 'lucide-react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (type.startsWith('audio/')) return <Music className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <Card 
      className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
        isDragging 
          ? 'border-secure bg-secure/5 scale-105' 
          : 'border-border hover:border-secure/50 hover:bg-secure/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-secure/10">
            <Upload className="h-8 w-8 text-secure" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Drop files to share securely</h3>
          <p className="text-muted-foreground text-sm">
            Supports images, videos, audio, documents and more
          </p>
        </div>
        <div className="flex justify-center space-x-4 text-muted-foreground">
          {getFileIcon('image/')}
          {getFileIcon('video/')}
          {getFileIcon('audio/')}
          {getFileIcon('application/pdf')}
        </div>
      </div>
    </Card>
  );
};

export default FileDropZone;