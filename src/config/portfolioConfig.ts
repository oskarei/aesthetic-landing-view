
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ContactInfo {
  name: string;
  location: string;
  email: string;
  socialLinks: SocialLink[];
}

export const backgroundImages = [
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2071",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2274",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2274",
  "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=2274",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2574"
];

export const contactInfo: ContactInfo = {
  name: "Your Name",
  location: "Kópavogur, Iceland",
  email: "your.email@example.com",
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/yourusername",
      icon: Github
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
      icon: Linkedin
    }
  ]
};

export const portfolioContent = {
  title: "Developer & Designer",
  subtitle: "Based in Iceland",
  description: "I build exceptional digital experiences focused on simplicity and functionality."
};
