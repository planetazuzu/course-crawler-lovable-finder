
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onExtract: () => void;
  isLoading: boolean;
}

const UrlInput = ({ url, setUrl, onExtract, isLoading }: UrlInputProps) => {
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
    setUrl(value);
    validateUrl(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onExtract();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="https://example.com/courses"
            value={url}
            onChange={handleChange}
            className={`pr-10 ${!isValid ? 'border-red-500' : ''}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {!isValid && (
          <p className="text-sm text-red-500">Please enter a valid URL</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isLoading || url === ""}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting...
          </>
        ) : (
          "Extract Data"
        )}
      </Button>
    </form>
  );
};

export default UrlInput;
