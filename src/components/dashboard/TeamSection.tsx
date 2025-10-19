
import { useState } from 'react';
import { MessageSquare, Facebook, Instagram, MessageCircle } from 'lucide-react';
import TeamMember from '@/components/team/TeamMember';
import teamData from '@/components/team/teamData';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamSectionProps {
  packageType: string;
}

const TeamSection = ({ packageType }: TeamSectionProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  
  // Filter team members based on package type
  const getTeamMembers = () => {
    if (packageType === 'starter') {
      return teamData.slice(0, 2); // First 2 members for starter
    } else if (packageType === 'professional') {
      return teamData.slice(0, 3); // First 3 members for professional
    } else {
      return teamData; // All members for enterprise
    }
  };
  
  const availableTeamMembers = getTeamMembers();
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Your Dedicated Team</h2>
        <p className="mt-1 text-sm text-gray-600">
          Meet the experts who will help you achieve your digital goals
          {packageType !== 'enterprise' && (
            <span className="ml-1 text-skilllink-green">
              (Upgrade your package to unlock more team members)
            </span>
          )}
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableTeamMembers.map((member) => (
            <div key={member.name} className="flex flex-col">
              <TeamMember 
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageUrl={member.imageUrl}
                socialLinks={member.socialLinks}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="mt-3 w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                    onClick={() => setSelectedMember(member.name)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Directly
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contact {selectedMember}</DialogTitle>
                    <DialogDescription>
                      Choose your preferred communication channel
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="telegram" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="telegram">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Telegram</span>
                      </TabsTrigger>
                      <TabsTrigger value="facebook">
                        <Facebook className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Facebook</span>
                      </TabsTrigger>
                      <TabsTrigger value="instagram">
                        <Instagram className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Instagram</span>
                      </TabsTrigger>
                      <TabsTrigger value="whatsapp">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 mr-2" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        <span className="hidden sm:inline">WhatsApp</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="telegram" className="mt-4">
                      <p className="text-center py-4">
                        Contact via Telegram: <a href="https://t.me/skilllink" className="text-blue-500 hover:underline">@skilllink</a>
                      </p>
                    </TabsContent>
                    <TabsContent value="facebook" className="mt-4">
                      <p className="text-center py-4">
                        Contact via Facebook: <a href="https://facebook.com/skilllink" className="text-blue-500 hover:underline">@skilllink</a>
                      </p>
                    </TabsContent>
                    <TabsContent value="instagram" className="mt-4">
                      <p className="text-center py-4">
                        Contact via Instagram: <a href="https://instagram.com/skilllink" className="text-blue-500 hover:underline">@skilllink</a>
                      </p>
                    </TabsContent>
                    <TabsContent value="whatsapp" className="mt-4">
                      <p className="text-center py-4">
                        Contact via WhatsApp: <a href="https://wa.me/1234567890" className="text-blue-500 hover:underline">+1 (234) 567-890</a>
                      </p>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
