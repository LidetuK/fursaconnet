
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Mail, Github } from "lucide-react";

export interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
    github?: string;
  };
}

const TeamMember = ({ name, role, bio, imageUrl, socialLinks }: TeamMemberProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden bg-muted">
        <Avatar className="h-full w-full rounded-none">
          <AvatarImage src={imageUrl} alt={name} className="object-cover h-full w-full" />
          <AvatarFallback className="text-xl font-semibold h-full w-full rounded-none">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-skilllink-green font-medium mb-3">{role}</p>
        <p className="text-sm text-skilllink-dark-gray mb-4 line-clamp-3">{bio}</p>
        
        <div className="flex gap-3 mt-auto">
          {socialLinks.linkedin && (
            <a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-skilllink-dark-gray hover:text-skilllink-green transition-colors"
              aria-label={`${name}'s LinkedIn profile`}
            >
              <Linkedin size={18} />
            </a>
          )}
          
          {socialLinks.twitter && (
            <a 
              href={socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-skilllink-dark-gray hover:text-skilllink-green transition-colors"
              aria-label={`${name}'s Twitter profile`}
            >
              <Twitter size={18} />
            </a>
          )}
          
          {socialLinks.github && (
            <a 
              href={socialLinks.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-skilllink-dark-gray hover:text-skilllink-green transition-colors"
              aria-label={`${name}'s GitHub profile`}
            >
              <Github size={18} />
            </a>
          )}
          
          {socialLinks.email && (
            <a 
              href={`mailto:${socialLinks.email}`}
              className="text-skilllink-dark-gray hover:text-skilllink-green transition-colors"
              aria-label={`Email ${name}`}
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
