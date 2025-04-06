
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Search, Calendar, Clock, ClipboardCopy, Download } from "lucide-react";
import { CourseData } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface ResultsDisplayProps {
  results: CourseData[];
  onClear: () => void;
}

const ResultsDisplay = ({ results, onClear }: ResultsDisplayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredResults = results.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportResults = () => {
    try {
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `course-data-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export Successful",
        description: "Course data has been exported as JSON"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      toast({
        title: "Copied to Clipboard",
        description: "Course data has been copied to your clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "There was an error copying the data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Extracted Courses {results.length > 0 && `(${results.length})`}</h2>
        
        {results.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Input
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={exportResults}
                title="Download JSON"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={onClear}
                title="Clear results"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {results.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="py-12">
              <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-sm text-muted-foreground">
                Configure your extraction settings and click "Extract Data" to get started
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((course, index) => (
            <Card key={index} className="result-card overflow-hidden border border-gray-200 hover:shadow-lg">
              <CardHeader className="pb-2 bg-primary/5">
                <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="py-4">
                {course.description && (
                  <ScrollArea className="h-24 w-full mb-4">
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </ScrollArea>
                )}
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.duration && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </Badge>
                  )}
                  
                  {course.startDate && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {course.startDate}
                    </Badge>
                  )}
                  
                  {course.cost && (
                    <Badge variant="secondary" className="font-semibold">
                      {course.cost}
                    </Badge>
                  )}
                  
                  {course.subsidized && (
                    <Badge variant="default">
                      Bonificable
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              {course.url && (
                <CardFooter className="pt-0">
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-primary underline hover:text-primary/80"
                  >
                    View course page
                  </a>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
