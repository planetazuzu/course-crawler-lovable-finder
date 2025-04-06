
import * as XLSX from "xlsx";
import { ImportedConfig, ScrapingConfig, SelectorConfig } from "@/types";

export const readExcelFile = (file: File): Promise<any[]> => {
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

export const processExcelData = (data: any[]): ScrapingConfig[] => {
  return data.map((row, index) => {
    // Validar campos obligatorios
    if (!row.name || !row.baseUrl) {
      throw new Error(`Fila ${index + 1}: Faltan campos obligatorios (nombre o URL base)`);
    }
    
    // Crear configuración de selectores con título por defecto
    const selectors: SelectorConfig = {
      title: "" // Default empty string to satisfy the type requirement
    };
    
    // Configurar selectores
    const selectorFields = ["title", "description", "startDate", "duration", "cost", "subsidized", "url", "imageUrl"];
    
    for (const field of selectorFields) {
      const selectorKey = `selector_${field}`;
      if (row[selectorKey]) {
        selectors[field as keyof SelectorConfig] = row[selectorKey];
      }
    }
    
    // Crear configuración base
    const config: ImportedConfig = {
      name: row.name,
      description: row.description || `Configuración para ${row.name}`,
      baseUrl: row.baseUrl,
      selectors
    };
    
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
    
    // Convert to ScrapingConfig
    return {
      id: `imported-${Date.now()}-${index}`,
      ...config,
    };
  });
};
