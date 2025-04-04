
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Recipe } from '@/types/recipe';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { jsonToHtml } from '@contentstack/json-rte-serializer';
import { Button } from '@/components/ui/button';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = format(new Date(recipe.date), 'MMMM d, yyyy');
  
  // Function to get the full text content from RTE JSON, excluding images and media
  const getBodyContent = (bodyContent: string) => {
    try {
      // Try to parse the JSON string
      const contentJson = JSON.parse(bodyContent);
      
      // First try to use the serializer to get HTML
      const htmlContent = jsonToHtml(contentJson);
      
      // Create a temporary div to extract text and remove images
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Remove all image elements and figure captions
      const images = tempDiv.querySelectorAll('img, figure, figcaption');
      images.forEach(img => img.remove());
      
      return tempDiv.innerHTML;
    } catch (e) {
      // Fallback to the original string if not valid JSON
      return bodyContent;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 border-none bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg rounded-xl">
      <CardContent className="p-0">
        <div className="p-6 space-y-4">
          {/* Recipe Header */}
          <div className="space-y-2">
            <Link to={recipe.id} className="block group">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                {recipe.title}
              </h2>
              <p className="text-gray-600 italic mt-1">{recipe.tagline}</p>
            </Link>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {recipe.taxonomy.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 px-2.5 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Author and Date */}
          <div className="flex justify-between items-center text-sm text-gray-500 py-2 border-t border-b border-gray-100">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <span>{recipe.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {/* Recipe Content */}
          <div className="prose max-w-none">
            <div 
              className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-4'}`}
              dangerouslySetInnerHTML={{ __html: getBodyContent(recipe.body) }}
            />
            
            <div className="flex justify-between items-center mt-4 pt-2">
              <Button
                variant="ghost" 
                onClick={toggleExpand}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? "Sýna minna" : "Lesa meira"}
              </Button>
              
              <Link 
                to={recipe.id} 
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Opna uppskrift <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
