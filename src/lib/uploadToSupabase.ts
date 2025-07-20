import { supabase } from '@/integrations/supabase/client';

export async function uploadLogoToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('sme-logos')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from('sme-logos').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
} 