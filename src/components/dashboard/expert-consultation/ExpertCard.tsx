import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expert } from '@/hooks/useExperts';
import TaskAssignmentModal from './TaskAssignmentModal';
import { User, Clock, DollarSign, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExpertCardProps {
  expert: Expert;
  packageType: string;
  onBookConsultation: (expertId: string) => void;
}

const ExpertCard = ({ expert, packageType, onBookConsultation }: ExpertCardProps) => {
  const displayName = expert.full_name; // Always use the real name
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const getSignedUrl = async () => {
      if (expert.profile_picture_url) {
        // Extract the path after '/profile-pictures/'
        const pathParts = expert.profile_picture_url.split('/profile-pictures/');
        const path = pathParts[1] ? `experts/${pathParts[1].split('experts/')[1]}` : '';
        if (path) {
          const { data, error } = await supabase.storage
            .from('profile-pictures')
            .createSignedUrl(path, 60 * 60); // 1 hour expiry
          if (data?.signedUrl) setSignedUrl(data.signedUrl);
        }
      }
    };
    getSignedUrl();
  }, [expert.profile_picture_url]);

  const avatarUrl = signedUrl || expert.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

  return (
    <Card className="h-full flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
        <img 
          src={avatarUrl} 
          alt={displayName}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
          }}
        />
        <div className="absolute top-2 right-2 z-10">
          <Badge 
            variant={expert.availability_status === 'available' ? 'default' : 'secondary'}
            className={expert.availability_status === 'available' ? 'bg-green-500' : ''}
          >
            {expert.availability_status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-4 w-4" />
          {displayName}
        </CardTitle>
        <CardDescription className="font-medium text-skilllink-green">
          {expert.specialization}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1">
        {expert.bio && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{expert.bio}</p>
        )}
        
        <div className="space-y-2 text-sm">
          {expert.experience_years && expert.experience_years > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-3 w-3" />
              {expert.experience_years} years experience
            </div>
          )}
          
          {expert.hourly_rate && (
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-3 w-3" />
              ${expert.hourly_rate}/hour
            </div>
          )}
        </div>

        {expert.skills && expert.skills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {expert.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {expert.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{expert.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 space-y-2">
        <div className="w-full space-y-2">
          <Button 
            className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
            onClick={() => onBookConsultation(expert.id)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book Consultation
          </Button>
          
          <TaskAssignmentModal expert={expert}>
            <Button variant="outline" className="w-full">
              Assign Task
            </Button>
          </TaskAssignmentModal>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;
