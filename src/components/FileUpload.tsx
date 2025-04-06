
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";

interface FileUploadProps {
  onUpload: (content: string) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpload(e.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <FileJson className="h-10 w-10 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">Upload Configuration File</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop your JSON configuration file here, or click to browse
      </p>
      <Button variant="outline" type="button">
        <Upload className="h-4 w-4 mr-2" />
        Browse Files
      </Button>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
