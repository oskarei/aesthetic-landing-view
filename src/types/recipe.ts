
export interface Recipe {
  id: string;
  title: string;
  author: string;
  date: string;
  tagline: string;
  taxonomy: string[];
  body: string;
  image: string;
  slug?: string; // Optional because existing recipes might not have it yet
}
