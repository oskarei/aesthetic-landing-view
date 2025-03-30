import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Recipe } from '@/types/recipe';
import { Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createRecipeSlug } from '@/lib/slugify';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const formattedDate = format(new Date(recipe.date), 'MMMM d, yyyy');
  const recipeSlug = recipe.slug || createRecipeSlug(recipe.title);
  
  return (
    <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold">
            <Link to={`/matur/${recipeSlug}`} className="hover:text-primary transition-colors">
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
          {recipe.body.split('\n\n').slice(0, 2).map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "font-medium" : "text-muted-foreground"}>
              {paragraph.replace(/^#{1,6}\s+/, '')}
            </p>
          ))}
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
