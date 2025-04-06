
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ScrapingConfig } from "@/types";
import DropZone from "./DropZone";
import FilePreview from "./FilePreview";
import DataPreview from "./DataPreview";
import FormatGuide from "./FormatGuide";
import { readExcelFile, processExcelData } from "./excelUtils";

interface ExcelImporterProps {
  onImport: (configs: ScrapingConfig[]) => void;
}

const ExcelImporter = ({ onImport }: ExcelImporterProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);
    
    if (files.length === 0) return;
    
    const file = files[0];
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError("Formato de archivo no válido. Por favor, sube un archivo Excel (.xlsx, .xls) o CSV.");
      return;
    }
    
    setFile(file);
    parseExcel(file);
  };

  const parseExcel = async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await readExcelFile(file);
      setPreviewData(data);
      setIsProcessing(false);
    } catch (error) {
      setError("Error al leer el archivo: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  const processImport = () => {
    if (!previewData) return;
    
    try {
      const configs = processExcelData(previewData);
      onImport(configs);
      
      // Limpiar estado
      setFile(null);
      setPreviewData(null);
      
      toast({
        title: "Importación exitosa",
        description: `Se han importado ${configs.length} configuraciones.`
      });
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const cancelImport = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!file ? (
        <DropZone 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onFileSelect={handleFileChange}
        />
      ) : (
        <>
          <FilePreview file={file} />
          
          {previewData && (
            <DataPreview 
              previewData={previewData}
              onCancel={cancelImport}
              onImport={processImport}
            />
          )}
          
          {isProcessing && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </>
      )}
      
      <FormatGuide />
    </div>
  );
};

export default ExcelImporter;
