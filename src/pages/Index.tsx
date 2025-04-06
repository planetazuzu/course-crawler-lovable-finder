
import { useState } from "react";
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
import { extractData } from "@/lib/scraper";
import { CourseData, ScrapingConfig } from "@/types";
import { sampleConfigs } from "@/lib/sample-data";

const Index = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CourseData[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ScrapingConfig | null>(null);
  const [customConfig, setCustomConfig] = useState<string>("");
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scrape",
        variant: "destructive",
      });
      return;
    }

    if (!selectedConfig && !customConfig) {
      toast({
        title: "Configuration Required",
        description: "Please select or upload a configuration file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real implementation, this would make an API call to a backend service
      // For demo purposes, we'll simulate the extraction with mock data
      const config = selectedConfig || JSON.parse(customConfig);
      const extractedData = await extractData(url, config);
      
      setResults(extractedData);
      
      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${extractedData.length} courses`,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
      title: "Configuration Selected",
      description: `Selected configuration: ${config.name}`,
    });
  };

  const handleFileUpload = (content: string) => {
    try {
      // Validate JSON format
      JSON.parse(content);
      setCustomConfig(content);
      setSelectedConfig(null);
      toast({
        title: "Configuration Loaded",
        description: "Custom configuration file loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Invalid Configuration",
        description: "The uploaded file is not a valid JSON configuration",
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
        <Card className="mb-8 overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Target URL</h2>
                <UrlInput 
                  url={url} 
                  setUrl={setUrl} 
                  onExtract={handleExtract} 
                  isLoading={isLoading} 
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Extraction Configuration</h2>
                <Tabs defaultValue="select">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="select">Select Preset</TabsTrigger>
                    <TabsTrigger value="upload">Upload Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="select">
                    <ConfigSelector 
                      configs={sampleConfigs} 
                      selectedConfig={selectedConfig}
                      onSelect={handleConfigSelect}
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <FileUpload onUpload={handleFileUpload} />
                    {customConfig && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Custom Configuration Loaded</h3>
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
