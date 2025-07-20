import { supabase } from '@/integrations/supabase/client';

export async function uploadExpertCertificationsToSupabase(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    // Get the original file extension
    const originalName = file.name;
    const fileExt = originalName.split('.').pop()?.toLowerCase();
    
    // Validate file extension
    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new Error(`File type .${fileExt} is not allowed. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files.`);
    }
    
    // Create a unique filename with timestamp and random string, preserving original extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    
    console.log(`Uploading file: ${originalName} as ${fileName}`);
    
    const { data, error } = await supabase.storage
      .from('expert-certifications')
      .upload(fileName, file, { 
        cacheControl: '3600', 
        upsert: false,
        contentType: file.type // Preserve the original MIME type
      });
    
    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${originalName}: ${error.message}`);
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('expert-certifications')
      .getPublicUrl(fileName);
    
    urls.push(publicUrlData.publicUrl);
    console.log(`Successfully uploaded: ${originalName} -> ${publicUrlData.publicUrl}`);
  }
  return urls;
} 