
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Recipe } from '@/types/recipe';
import { Calendar, User } from 'lucide-react';
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
    <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold">
            <Link to={recipe.id} className="hover:text-primary transition-colors">
              {recipe.title}
            </Link>
          </h2>
        </div>
        <p className="text-muted-foreground text-lg italic mb-2">{recipe.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {recipe.taxonomy.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{recipe.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="font-medium">{getTextPreview(recipe.body, 100)}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full h-[200px] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
