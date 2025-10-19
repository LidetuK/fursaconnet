
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, MessageCircle, CheckSquare, BarChart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExpertProfileSetup from '@/components/dashboard/ExpertProfileSetup';
import TaskManagement from '@/components/dashboard/TaskManagement';
import ExpertConversations from '@/components/dashboard/ExpertConversations';
import UserProfile from '@/components/dashboard/UserProfile';

const ExpertDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userType, setUserType] = useState<string | null>(null);
  const [hasExpertProfile, setHasExpertProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserTypeAndProfile();
    }
  }, [user]);

  const checkUserTypeAndProfile = async () => {
    try {
      // Check user type - commented out Supabase call
      // const { data: profile } = await supabase
      //   .from('profiles')
      //   .select('user_type')
      //   .eq('id', user?.id)
      //   .single();

      // setUserType(profile?.user_type || null);
      setUserType('digital_expert'); // Default for expert users

      // Check if expert profile exists - commented out Supabase call
      // if (profile?.user_type === 'digital_expert') {
      //   const { data: expertProfile } = await supabase
      //     .from('digital_expert_profiles')
      //     .select('id')
      //     .eq('user_id', user?.id)
      //     .maybeSingle();

      setHasExpertProfile(false); // Default to false for now
    } catch (error: any) {
      console.error('Error checking user profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Redirect non-authenticated users
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Redirect non-digital experts to main dashboard
  if (!loading && userType !== 'digital_expert') {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-skilllink-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <img
                src="https://res.cloudinary.com/dkzw06zke/image/upload/v1748200742/skill_link_logo_hwmy6f.png"
                alt="SkillLink Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Digital Expert Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {!hasExpertProfile ? (
          // Show profile setup if no expert profile exists
          <ExpertProfileSetup />
        ) : (
          // Show full dashboard if profile exists
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="conversations" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-6">
              <TaskManagement />
            </TabsContent>
            
            <TabsContent value="conversations" className="mt-6">
              <ExpertConversations />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <ExpertProfileSetup />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <UserProfile />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;
