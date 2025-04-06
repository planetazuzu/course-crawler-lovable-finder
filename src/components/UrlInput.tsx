
import { useState } from "react";
import { X, Plus, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UrlInputProps {
  urls: string[];
  setUrls: (urls: string[]) => void;
  onExtract: () => void;
  isLoading: boolean;
}

const UrlInput = ({ urls, setUrls, onExtract, isLoading }: UrlInputProps) => {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateUrl = (input: string) => {
    try {
      new URL(input);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(input === "");
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentUrl(value);
    validateUrl(value);
  };

  const handleAddUrl = () => {
    if (validateUrl(currentUrl) && !urls.includes(currentUrl)) {
      setUrls([...urls, currentUrl]);
      setCurrentUrl("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urls.length > 0) {
      onExtract();
    } else if (validateUrl(currentUrl)) {
      handleAddUrl();
      setTimeout(onExtract, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="https://example.com/courses"
            value={currentUrl}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`pr-10 ${!isValid ? 'border-red-500' : ''}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {!isValid && (
          <p className="text-sm text-red-500">Por favor introduce una URL válida</p>
        )}

        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUrl}
            disabled={!isValid || currentUrl === ""}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Añadir URL
          </Button>
        </div>
      </div>

      {urls.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {urls.map((url, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {url.length > 30 ? `${url.substring(0, 30)}...` : url}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveUrl(url)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={(urls.length === 0 && (currentUrl === "" || !isValid)) || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extrayendo...
          </>
        ) : (
          `Extraer Datos ${urls.length > 0 ? `(${urls.length} URLs)` : ""}`
        )}
      </Button>
    </form>
  );
};

export default UrlInput;
