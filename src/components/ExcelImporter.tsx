
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImportedConfig, ScrapingConfig } from "@/types";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as XLSX from "xlsx";

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

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const processImport = () => {
    if (!previewData) return;
    
    try {
      const configs: ScrapingConfig[] = previewData.map((row, index) => {
        // Validar campos obligatorios
        if (!row.name || !row.baseUrl) {
          throw new Error(`Fila ${index + 1}: Faltan campos obligatorios (nombre o URL base)`);
        }
        
        // Crear configuración base
        const config: ImportedConfig = {
          name: row.name,
          description: row.description || `Configuración para ${row.name}`,
          baseUrl: row.baseUrl,
          selectors: {}
        };
        
        // Configurar selectores
        const selectorFields = ["title", "description", "startDate", "duration", "cost", "subsidized", "url", "imageUrl"];
        
        for (const field of selectorFields) {
          const selectorKey = `selector_${field}`;
          if (row[selectorKey]) {
            config.selectors[field] = row[selectorKey];
          }
        }
        
        // Configurar transformadores si existen
        const transformerFields = ["transformers_title", "transformers_description", "transformers_startDate", 
                                  "transformers_duration", "transformers_cost", "transformers_subsidized", 
                                  "transformers_url", "transformers_imageUrl"];
        
        for (const field of transformerFields) {
          if (row[field]) {
            if (!config.transformers) {
              config.transformers = {};
            }
            const fieldName = field.replace("transformers_", "");
            config.transformers[fieldName] = row[field];
          }
        }
        
        return {
          id: `imported-${Date.now()}-${index}`,
          ...config,
        };
      });
      
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
        <div 
          className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/70"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("excel-file")?.click()}
        >
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-primary/60" />
          <h3 className="text-lg font-medium mb-2">Importar desde Excel</h3>
          <p className="text-sm text-gray-500 mb-4">
            Arrastra y suelta un archivo Excel o haz clic para seleccionarlo
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Formatos soportados: .xlsx, .xls, .csv
          </p>
          <input 
            id="excel-file" 
            type="file" 
            accept=".xlsx,.xls,.csv" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <FileSpreadsheet className="h-6 w-6 mr-2 text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          
          {previewData && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Vista previa ({previewData.length} configuraciones)</h3>
              <div className="max-h-60 overflow-y-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">URL Base</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Selectores</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{row.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{row.baseUrl}</td>
                        <td className="px-4 py-2 text-sm">
                          {Object.keys(row)
                            .filter(key => key.startsWith("selector_"))
                            .map(key => key.replace("selector_", ""))
                            .join(", ")}
                        </td>
                      </tr>
                    ))}
                    {previewData.length > 5 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm text-center text-gray-500">
                          Y {previewData.length - 5} más...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={cancelImport}>
                  Cancelar
                </Button>
                <Button onClick={processImport}>
                  Importar ({previewData.length})
                </Button>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </>
      )}
      
      <Card className="p-4 bg-primary/5 mt-6">
        <h4 className="font-medium mb-2">Formato esperado del Excel</h4>
        <p className="text-sm mb-2">El archivo debe contener las siguientes columnas:</p>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          <li><strong>name</strong>: Nombre de la configuración (obligatorio)</li>
          <li><strong>description</strong>: Descripción de la configuración</li>
          <li><strong>baseUrl</strong>: URL base del sitio web (obligatorio)</li>
          <li><strong>selector_title</strong>: Selector CSS para el título del curso</li>
          <li><strong>selector_description</strong>: Selector CSS para la descripción</li>
          <li><strong>selector_startDate</strong>: Selector CSS para la fecha de inicio</li>
          <li><strong>selector_duration</strong>: Selector CSS para la duración</li>
          <li><strong>selector_cost</strong>: Selector CSS para el coste</li>
          <li><strong>selector_subsidized</strong>: Selector CSS para determinar si es bonificable</li>
          <li><strong>selector_url</strong>: Selector CSS para la URL del curso</li>
          <li><strong>selector_imageUrl</strong>: Selector CSS para la imagen del curso</li>
        </ul>
      </Card>
    </div>
  );
};

export default ExcelImporter;
