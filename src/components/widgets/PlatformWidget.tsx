
import { Link2, GraduationCap } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

const PlatformWidget = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button 
            variant="default" 
            className="bg-skilllink-green hover:bg-skilllink-dark-green text-white w-full flex items-center gap-2"
            onClick={() => window.open('http://skilllink.africa/', '_blank')}
          >
            <Link2 className="h-4 w-4" />
            SkillLink Africa
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div>
              <h4 className="text-sm font-semibold">SkillLink Platform</h4>
              <p className="text-sm text-muted-foreground">
                Connect with top digital marketing professionals and companies. 
                Find the perfect match for your digital marketing needs.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button 
            variant="default" 
            className="bg-skilllink-green hover:bg-skilllink-dark-green text-white w-full flex items-center gap-2"
            onClick={() => window.open('https://skilllinkcourses.com/', '_blank')}
          >
            <GraduationCap className="h-4 w-4" />
            SkillLink Courses
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div>
              <h4 className="text-sm font-semibold">SkillLink Courses</h4>
              <p className="text-sm text-muted-foreground">
                Enhance your digital marketing skills with certified courses. 
                Get certified and boost your professional profile.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default PlatformWidget;
