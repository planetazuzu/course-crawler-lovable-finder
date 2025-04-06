
import { Button } from "@/components/ui/button";

interface DataPreviewProps {
  previewData: any[];
  onCancel: () => void;
  onImport: () => void;
}

const DataPreview = ({ previewData, onCancel, onImport }: DataPreviewProps) => {
  return (
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
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onImport}>
          Importar ({previewData.length})
        </Button>
      </div>
    </div>
  );
};

export default DataPreview;
