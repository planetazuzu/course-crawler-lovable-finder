
import { Code2, Database, Globe } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary py-6 px-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Code2 className="h-8 w-8 text-white mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Course Crawler</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-white">
            <Globe className="h-5 w-5 mr-2" />
            <span className="text-sm md:text-base">Web Scraper</span>
          </div>
          
          <div className="flex items-center text-white">
            <Database className="h-5 w-5 mr-2" />
            <span className="text-sm md:text-base">Data Extractor</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
