import { CourseData, ScrapingConfig } from "@/types";
import { mockCourseData } from "./sample-data";

/**
 * In a real implementation, this function would make an API call to a backend service
 * that performs the actual web scraping. For this demo, we're using mock data.
 */
export const extractData = async (url: string, config: ScrapingConfig): Promise<CourseData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Log the extraction request for debugging
  console.log("Extraction request:", { url, config });
  
  // For demo purposes, return mock data
  // In a real implementation, this would process the HTML response using the provided selectors
  return mockCourseData.map(course => ({
    ...course,
    // Randomly vary the mock data to simulate different extraction results
    subsidized: Math.random() > 0.3
  }));
};

/**
 * In a real implementation, this function would perform server-side scraping
 * using a library like cheerio, puppeteer, or playwright.
 * This is a placeholder for that functionality.
 */
export const performScraping = async (html: string, config: ScrapingConfig): Promise<CourseData[]> => {
  // This would process the HTML using the provided selectors
  // For example, with cheerio:
  /*
  const $ = cheerio.load(html);
  const courses: CourseData[] = [];
  
  $(config.courseSelector).each((_, el) => {
    const title = $(el).find(config.selectors.title).text().trim();
    // ... extract other fields
    
    courses.push({
      title,
      // ... other fields
    });
  });
  
  return courses;
  */
  
  // For this demo, return mock data
  return mockCourseData;
};

/**
 * Save extracted data to local storage
 */
export const saveResults = (data: CourseData[]): void => {
  try {
    localStorage.setItem('extractedCourses', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load saved results from local storage
 */
export const loadSavedResults = (): CourseData[] => {
  try {
    const savedData = localStorage.getItem('extractedCourses');
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};
