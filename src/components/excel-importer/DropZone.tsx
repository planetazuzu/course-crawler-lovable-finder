
import { FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DropZone = ({ onDrop, onDragOver, onFileSelect }: DropZoneProps) => {
  return (
    <div 
      className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/70"
      onDrop={onDrop}
      onDragOver={onDragOver}
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
        onChange={onFileSelect}
      />
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Seleccionar archivo
      </Button>
    </div>
  );
};

export default DropZone;
