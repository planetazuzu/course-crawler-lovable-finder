
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import UrlInput from "@/components/UrlInput";
import ConfigSelector from "@/components/ConfigSelector";
import ResultsDisplay from "@/components/ResultsDisplay";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Settings } from "lucide-react";
import { extractData, loadSavedConfigs, loadSavedResults } from "@/lib/scraper";
import { CourseData, ScrapingConfig } from "@/types";

const Index = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CourseData[]>(loadSavedResults());
  const [availableConfigs, setAvailableConfigs] = useState<ScrapingConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ScrapingConfig | null>(null);
  const [customConfig, setCustomConfig] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Cargar configuraciones guardadas
    const configs = loadSavedConfigs();
    setAvailableConfigs(configs);
    
    // Seleccionar la primera configuración habilitada por defecto
    const enabledConfig = configs.find(c => c.enabled);
    if (enabledConfig) {
      setSelectedConfig(enabledConfig);
    }
  }, []);

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: "URL Requerida",
        description: "Por favor introduce una URL para extraer datos",
        variant: "destructive",
      });
      return;
    }

    if (!selectedConfig && !customConfig) {
      toast({
        title: "Configuración Requerida",
        description: "Por favor selecciona o sube un archivo de configuración",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // En una implementación real, esto haría una llamada a un servicio backend
      // Para la demostración, simulamos la extracción con datos de ejemplo
      const config = selectedConfig || JSON.parse(customConfig);
      const extractedData = await extractData(url, config);
      
      setResults(extractedData);
      
      toast({
        title: "Extracción Completada",
        description: `Se han extraído ${extractedData.length} cursos con éxito`,
      });
    } catch (error) {
      console.error("Error de extracción:", error);
      toast({
        title: "Error en la Extracción",
        description: error instanceof Error ? error.message : "Ha ocurrido un error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSelect = (config: ScrapingConfig) => {
    setSelectedConfig(config);
    setCustomConfig("");
    toast({
      title: "Configuración Seleccionada",
      description: `Configuración seleccionada: ${config.name}`,
    });
  };

  const handleFileUpload = (content: string) => {
    try {
      // Validar formato JSON
      JSON.parse(content);
      setCustomConfig(content);
      setSelectedConfig(null);
      toast({
        title: "Configuración Cargada",
        description: "Archivo de configuración personalizada cargado con éxito",
      });
    } catch (error) {
      toast({
        title: "Configuración Inválida",
        description: "El archivo subido no es una configuración JSON válida",
        variant: "destructive",
      });
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Extractor de Cursos</h1>
          <Link to="/configurations">
            <Button variant="outline" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Gestionar Configuraciones
            </Button>
          </Link>
        </div>
        
        <Card className="mb-8 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">URL Objetivo</h2>
                <UrlInput 
                  url={url} 
                  setUrl={setUrl} 
                  onExtract={handleExtract} 
                  isLoading={isLoading} 
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Configuración de Extracción</h2>
                <Tabs defaultValue="select">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="select">Seleccionar Configuración</TabsTrigger>
                    <TabsTrigger value="upload">Subir Personalizada</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="select">
                    {availableConfigs.length === 0 ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No hay configuraciones disponibles</AlertTitle>
                        <AlertDescription>
                          No hay configuraciones habilitadas. Por favor, gestiona tus configuraciones 
                          o sube una configuración personalizada.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <ConfigSelector 
                        configs={availableConfigs.filter(c => c.enabled)} 
                        selectedConfig={selectedConfig}
                        onSelect={handleConfigSelect}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <FileUpload onUpload={handleFileUpload} />
                    {customConfig && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Configuración Personalizada Cargada</h3>
                        <ScrollArea className="h-[200px] w-full rounded-md border code-editor p-4 bg-gray-50 dark:bg-gray-900">
                          <pre className="text-xs">{customConfig}</pre>
                        </ScrollArea>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-8" />
        
        <ResultsDisplay results={results} onClear={clearResults} />
      </main>
    </div>
  );
};

export default Index;
