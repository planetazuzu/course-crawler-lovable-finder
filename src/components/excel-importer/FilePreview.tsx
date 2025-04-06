
import { FileSpreadsheet } from "lucide-react";

interface FilePreviewProps {
  file: File;
}

const FilePreview = ({ file }: FilePreviewProps) => {
  return (
    <div className="flex items-center">
      <FileSpreadsheet className="h-6 w-6 mr-2 text-primary" />
      <div>
        <p className="font-medium">{file.name}</p>
        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
      </div>
    </div>
  );
};

export default FilePreview;
