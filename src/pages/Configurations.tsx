
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrapingConfig } from "@/types";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, FilePlus2, ArrowLeft, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ExcelImporter from "@/components/ExcelImporter";
import { loadSavedConfigs, saveConfigs } from "@/lib/scraper";

const Configurations = () => {
  const [configs, setConfigs] = useState<ScrapingConfig[]>(loadSavedConfigs());
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<ScrapingConfig | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleConfig = (id: string, enabled: boolean) => {
    const updatedConfigs = configs.map(config => 
      config.id === id ? { ...config, enabled } : config
    );
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    
    toast({
      title: enabled ? "Configuración activada" : "Configuración desactivada",
      description: `La configuración ha sido ${enabled ? 'activada' : 'desactivada'} correctamente.`,
    });
  };

  const handleCreateNew = () => {
    const newConfig: ScrapingConfig = {
      id: `config-${Date.now()}`,
      name: "Nueva configuración",
      description: "Descripción de la configuración",
      baseUrl: "https://example.com",
      selectors: {
        title: "",
        description: "",
        startDate: "",
        duration: "",
        cost: "",
        subsidized: "",
        url: "",
        imageUrl: ""
      },
      enabled: true
    };
    
    setCurrentConfig(newConfig);
    setEditMode(true);
  };

  const handleEdit = (config: ScrapingConfig) => {
    setCurrentConfig(config);
    setEditMode(true);
  };

  const handleDelete = (id: string) => {
    const updatedConfigs = configs.filter(config => config.id !== id);
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    
    toast({
      title: "Configuración eliminada",
      description: "La configuración ha sido eliminada correctamente."
    });
  };

  const handleSave = () => {
    if (!currentConfig) return;
    
    const isNew = !configs.some(config => config.id === currentConfig.id);
    let updatedConfigs: ScrapingConfig[];
    
    if (isNew) {
      updatedConfigs = [...configs, currentConfig];
    } else {
      updatedConfigs = configs.map(config => 
        config.id === currentConfig.id ? currentConfig : config
      );
    }
    
    setConfigs(updatedConfigs);
    saveConfigs(updatedConfigs);
    setEditMode(false);
    setCurrentConfig(null);
    
    toast({
      title: isNew ? "Configuración creada" : "Configuración actualizada",
      description: `La configuración ha sido ${isNew ? 'creada' : 'actualizada'} correctamente.`
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentConfig(null);
  };

  const handleConfigImport = (importedConfigs: ScrapingConfig[]) => {
    // Assign IDs to imported configs if they don't have them
    const configsWithIds = importedConfigs.map(config => ({
      ...config,
      id: config.id || `config-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      enabled: true
    }));
    
    const mergedConfigs = [...configs, ...configsWithIds];
    setConfigs(mergedConfigs);
    saveConfigs(mergedConfigs);
    
    toast({
      title: "Configuraciones importadas",
      description: `Se han importado ${importedConfigs.length} configuraciones correctamente.`
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (!currentConfig) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCurrentConfig({
        ...currentConfig,
        [parent]: {
          ...currentConfig[parent as keyof ScrapingConfig] as any,
          [child]: value
        }
      });
    } else {
      setCurrentConfig({
        ...currentConfig,
        [field]: value
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Gestión de Configuraciones</h1>
          </div>
          
          {!editMode && (
            <div className="flex gap-2">
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Configuración
              </Button>
            </div>
          )}
        </div>
        
        {editMode ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{currentConfig?.id ? 'Editar' : 'Nueva'} Configuración</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input 
                      value={currentConfig?.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nombre de la configuración"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Base</label>
                    <Input 
                      value={currentConfig?.baseUrl || ''} 
                      onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea 
                    value={currentConfig?.description || ''} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descripción de la configuración"
                    rows={2}
                  />
                </div>
                
                <h3 className="text-lg font-medium">Selectores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input 
                      value={currentConfig?.selectors?.title || ''} 
                      onChange={(e) => handleInputChange('selectors.title', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descripción</label>
                    <Input 
                      value={currentConfig?.selectors?.description || ''} 
                      onChange={(e) => handleInputChange('selectors.description', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha de inicio</label>
                    <Input 
                      value={currentConfig?.selectors?.startDate || ''} 
                      onChange={(e) => handleInputChange('selectors.startDate', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duración</label>
                    <Input 
                      value={currentConfig?.selectors?.duration || ''} 
                      onChange={(e) => handleInputChange('selectors.duration', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coste</label>
                    <Input 
                      value={currentConfig?.selectors?.cost || ''} 
                      onChange={(e) => handleInputChange('selectors.cost', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bonificable</label>
                    <Input 
                      value={currentConfig?.selectors?.subsidized || ''} 
                      onChange={(e) => handleInputChange('selectors.subsidized', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL</label>
                    <Input 
                      value={currentConfig?.selectors?.url || ''} 
                      onChange={(e) => handleInputChange('selectors.url', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Imagen</label>
                    <Input 
                      value={currentConfig?.selectors?.imageUrl || ''} 
                      onChange={(e) => handleInputChange('selectors.imageUrl', e.target.value)}
                      placeholder=".class o #id"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="configs" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="configs">Configuraciones</TabsTrigger>
                <TabsTrigger value="import">Importar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="configs">
                {configs.length === 0 ? (
                  <Card className="text-center p-8">
                    <CardContent>
                      <div className="py-12">
                        <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mx-auto mb-4">
                          <FilePlus2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No hay configuraciones</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Crea una nueva configuración o importa configuraciones existentes
                        </p>
                        <Button onClick={handleCreateNew}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Configuración
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {configs.map((config) => (
                      <Card key={config.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2 bg-primary/5">
                          <div className="flex justify-between items-start">
                            <CardTitle className="line-clamp-1 text-lg">{config.name}</CardTitle>
                            <Switch 
                              checked={config.enabled} 
                              onCheckedChange={(checked) => handleToggleConfig(config.id, checked)}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{config.description}</p>
                          <p className="text-sm font-medium mb-1">URL Base</p>
                          <p className="text-xs text-gray-500 mb-3 break-all">{config.baseUrl}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {config.selectors && Object.keys(config.selectors).map(key => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDelete(config.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleEdit(config)}
                            >
                              Editar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="import">
                <Card>
                  <CardHeader>
                    <CardTitle>Importar Configuraciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExcelImporter onImport={handleConfigImport} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Configurations;
