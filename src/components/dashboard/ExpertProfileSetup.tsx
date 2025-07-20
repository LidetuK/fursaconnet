import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ExpertProfileSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{
    specialization: string;
    experience_years: number;
    skills: string[];
    bio: string;
    availability_status: string;
    profile_picture_url?: string;
  }>({
    specialization: '',
    experience_years: 0,
    skills: [],
    bio: '',
    availability_status: 'available',
    profile_picture_url: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExpertProfile();
    }
  }, [user]);

  const fetchExpertProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('digital_expert_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          specialization: data.specialization || '',
          experience_years: data.experience_years || 0,
          skills: data.skills || [],
          bio: data.bio || '',
          availability_status: data.availability_status || 'available',
          profile_picture_url: data.profile_picture_url || '',
        });
        setHasProfile(true);
      }
    } catch (error: any) {
      console.error('Error fetching expert profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        user_id: user?.id as string,
        specialization: profile.specialization,
        experience_years: profile.experience_years,
        skills: profile.skills,
        bio: profile.bio,
        availability_status: profile.availability_status,
        profile_picture_url: profile.profile_picture_url || '',
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('digital_expert_profiles')
        .upsert(profileData);

      if (error) throw error;
      
      setHasProfile(true);
      toast({
        title: "Profile saved",
        description: "Your expert profile has been successfully saved."
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
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
      <div>
        <h2 className="text-2xl font-bold">Digital Expert Profile Setup</h2>
        <p className="text-gray-600">Complete your profile to start receiving task assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture to personalize your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {profile.profile_picture_url && (
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !user) return;
                const fileExt = file.name.split('.').pop();
                const filePath = `experts/${user.id}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                  .from('profile-pictures')
                  .upload(filePath, file, { upsert: true });
                if (uploadError) {
                  toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
                  return;
                }
                const { data: publicUrlData } = supabase.storage
                  .from('profile-pictures')
                  .getPublicUrl(filePath);
                setProfile({ ...profile, profile_picture_url: publicUrlData.publicUrl });
                toast({ title: 'Profile picture updated!' });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Tell us about your expertise and experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="specialization" className="text-sm font-medium">Specialization *</label>
              <Input 
                id="specialization" 
                placeholder="e.g., Social Media Marketing, SEO, Web Development"
                value={profile.specialization} 
                onChange={e => setProfile({...profile, specialization: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="experience_years" className="text-sm font-medium">Years of Experience</label>
              <Input 
                id="experience_years" 
                type="number"
                min="0"
                value={profile.experience_years} 
                onChange={e => setProfile({...profile, experience_years: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about your background, expertise, and what makes you unique..."
              value={profile.bio} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium">Skills</label>
            <div className="flex gap-2">
              <Input 
                id="skills" 
                placeholder="Add a skill and press Enter"
                value={skillInput} 
                onChange={e => setSkillInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill} type="button" variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSaveProfile} 
              disabled={saving || !profile.specialization}
              className="bg-skilllink-green hover:bg-skilllink-dark-green"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {hasProfile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertProfileSetup;
