
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ScrapingConfig } from "@/types";

interface ConfigSelectorProps {
  configs: ScrapingConfig[];
  selectedConfig: ScrapingConfig | null;
  onSelect: (config: ScrapingConfig) => void;
}

const ConfigSelector = ({ configs, selectedConfig, onSelect }: ConfigSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {configs.map((config) => (
        <Card 
          key={config.id}
          className={`cursor-pointer transition-all border-2 ${
            selectedConfig?.id === config.id 
              ? 'border-primary' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onSelect(config)}
        >
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle>{config.name}</CardTitle>
              <CardDescription className="line-clamp-1">{config.description}</CardDescription>
            </div>
            {selectedConfig?.id === config.id && (
              <Badge variant="default" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mt-2">
              {config.selectors && Object.keys(config.selectors).map(key => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConfigSelector;
