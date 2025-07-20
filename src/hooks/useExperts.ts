
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Expert {
  id: string;
  full_name: string;
  specialization: string;
  bio: string;
  avatar_url: string;
  experience_years: number;
  hourly_rate: number;
  availability_status: string;
  skills: string[];
  profile_picture_url: string;
}

export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExperts = async () => {
    try {
      setLoading(true);
      console.log('Fetching experts...');
      
      const { data, error } = await supabase.rpc('get_available_experts');
      
      if (error) {
        console.error('Error fetching experts:', error);
        throw error;
      }
      
      console.log('Fetched experts data:', data);
      
      // Transform the data to ensure proper structure
      const formattedExperts = (data || []).map(expert => ({
        id: expert.id,
        full_name: expert.full_name || 'Expert',
        specialization: expert.specialization || 'General',
        bio: expert.bio || '',
        avatar_url: expert.avatar_url || expert.profile_picture_url || `https://api.dicebear.com/7.x/initials/svg?seed=${expert.full_name || 'Expert'}`,
        experience_years: expert.experience_years || 0,
        hourly_rate: expert.hourly_rate || 0,
        availability_status: expert.availability_status || 'available',
        skills: expert.skills || [],
        profile_picture_url: expert.profile_picture_url || expert.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${expert.full_name || 'Expert'}`
      }));
      
      setExperts(formattedExperts);
      console.log('Successfully fetched experts:', formattedExperts.length);
    } catch (error: any) {
      console.error('Error fetching experts:', error);
      toast({
        title: "Error fetching experts",
        description: error.message || "Failed to load expert profiles",
        variant: "destructive"
      });
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return {
    experts,
    loading,
    refetchExperts: fetchExperts
  };
};
