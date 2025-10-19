import { supabase } from '@/integrations/supabase/client';

export async function uploadExpertPhotoToSupabase(file: File): Promise<string> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Please upload JPG, JPEG, PNG, or WebP images.`);
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB.');
  }

  // Get the original file extension
  const originalName = file.name;
  const fileExt = originalName.split('.').pop()?.toLowerCase();
  
  // Validate file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  if (!fileExt || !allowedExtensions.includes(fileExt)) {
    throw new Error(`File extension .${fileExt} is not allowed. Please upload JPG, JPEG, PNG, or WebP files.`);
  }
  
  // Create a unique filename with timestamp and random string, preserving original extension
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `${timestamp}-${randomString}.${fileExt}`;
  
  console.log(`Uploading profile photo: ${originalName} as ${fileName}`);
  console.log(`File type: ${file.type}, Size: ${file.size} bytes`);
  
  const { data, error } = await supabase.storage
    .from('expertphoto')
    .upload(fileName, file, { 
      cacheControl: '3600', 
      upsert: false,
      contentType: file.type // Preserve the original MIME type
    });

  if (error) {
    console.error('Profile photo upload error:', error);
    throw new Error(`Failed to upload profile photo ${originalName}: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from('expertphoto').getPublicUrl(fileName);
  console.log(`Successfully uploaded profile photo: ${originalName} -> ${publicUrlData.publicUrl}`);
  
  return publicUrlData.publicUrl;
} 
