
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Recipe } from '@/types/recipe';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { jsonToHtml } from '@contentstack/json-rte-serializer';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
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
      
      // Get the remaining text content
      return tempDiv.innerHTML;
    } catch (e) {
      // Fallback to the original string if not valid JSON
      return bodyContent;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
      <CardHeader className="pb-0 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            <Link to={recipe.id} className="hover:text-primary transition-colors">
              {recipe.title}
            </Link>
          </h2>
        </div>
        <p className="text-muted-foreground text-lg italic mb-2">{recipe.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {recipe.taxonomy.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            <span>{recipe.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <div className="prose max-w-none">
          {/* Display the full recipe body content without images and captions */}
          <div 
            className="font-medium text-gray-700"
            dangerouslySetInnerHTML={{ __html: getBodyContent(recipe.body) }}
          />
          <div className="mt-4 text-right">
            <Link 
              to={recipe.id} 
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Lesa meira <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
