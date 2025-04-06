
import { Card } from "@/components/ui/card";

const FormatGuide = () => {
  return (
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
  );
};

export default FormatGuide;
