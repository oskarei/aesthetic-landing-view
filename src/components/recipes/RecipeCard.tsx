
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
  
  // Function to get a plain text preview from RTE JSON content
  const getTextPreview = (bodyContent: string, maxLength: number = 300) => {
    try {
      // Try to parse the JSON string
      const contentJson = JSON.parse(bodyContent);
      
      // First try to use the serializer to get HTML and then extract text
      const htmlContent = jsonToHtml(contentJson);
      
      // Create a temporary div to extract text from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      return plainText.slice(0, maxLength) + (plainText.length > maxLength ? '...' : '');
    } catch (e) {
      // Fallback to the original string if not valid JSON
      return bodyContent.slice(0, maxLength) + (bodyContent.length > maxLength ? '...' : '');
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
          <p className="font-medium text-gray-700">{getTextPreview(recipe.body, 100)}</p>
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
