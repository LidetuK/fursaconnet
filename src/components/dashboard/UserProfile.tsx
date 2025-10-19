
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, LogOut, User } from 'lucide-react';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string;
    username: string;
  }>({
    full_name: '',
    username: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile({
        full_name: data?.full_name || '',
        username: data?.full_name || '', // Use full_name as a fallback for username since it doesn't exist in the schema yet
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          // We don't update username field since it doesn't exist in the schema yet
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) throw error;
      
      // Clear password fields
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      // User will be redirected by the auth context
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-skilllink-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Log Out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="password">
            <User className="h-4 w-4 mr-2" />
            Change Password
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="bg-gray-100"
                />
                <p className="text-xs text-skilllink-dark-gray">
                  Your email cannot be changed
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium">Full Name</label>
                <Input 
                  id="full_name" 
                  value={profile.full_name} 
                  onChange={e => setProfile({...profile, full_name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input 
                  id="username" 
                  value={profile.username} 
                  onChange={e => setProfile({...profile, username: e.target.value})}
                />
                <p className="text-xs text-skilllink-dark-gray">
                  Note: Username feature is under development. Changes will be saved in a future update.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={saving}
                className="bg-skilllink-green hover:bg-skilllink-dark-green"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="current_password" className="text-sm font-medium">Current Password</label>
                <Input 
                  id="current_password" 
                  type="password"
                  value={passwords.currentPassword} 
                  onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="new_password" className="text-sm font-medium">New Password</label>
                <Input 
                  id="new_password" 
                  type="password"
                  value={passwords.newPassword} 
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm_password" className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  id="confirm_password" 
                  type="password"
                  value={passwords.confirmPassword} 
                  onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePasswordChange} 
                disabled={saving}
                className="bg-skilllink-green hover:bg-skilllink-dark-green"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
