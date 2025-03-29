import { Github, Linkedin, Mail, MapPin, Instagram, Twitter, Music } from "lucide-react";

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ContactInfo {
  name: string;
  location: string;
  email: string;
  locationUrl: string;
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
  name: "Oskar Eiriksson",
  location: "Kópavogur, Iceland",
  email: "oskar@oskarei.com",
  locationUrl: "https://maps.google.com/?q=Kópavogur,Iceland",
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/oskarei",
      icon: Github
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/oskarei",
      icon: Linkedin
    },
    {
      name: "Instagram",
      url: "https://instagram.com/oskarei",
      icon: Instagram
    },
    {
      name: "X",
      url: "https://x.com/oskarei",
      icon: Twitter
    },
    {
      name: "Last.fm",
      url: "https://last.fm/user/oskarei",
      icon: Music
    }
  ]
};

export const portfolioContent = {
  title: "Oskar Eiriksson",
  subtitle: "Software Engineer / Solution Architect",
  description: "A geek, family man, espresso drinker, football fan, and (sometimes) a very precise guy. Working as a Solution Architect Manager at Contentstack."
};
