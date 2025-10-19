import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseUpload() {
  console.log('Testing Supabase upload...');
  
  // Create a simple test file
  const testContent = 'This is a test file content';
  const testBlob = new Blob([testContent], { type: 'text/plain' });
  const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
  
  console.log('Test file created:', {
    name: testFile.name,
    type: testFile.type,
    size: testFile.size
  });
  
  try {
    // Test upload to expert-certifications bucket
    const fileName = `test-${Date.now()}.txt`;
    console.log('Uploading to expert-certifications bucket...');
    
    const { data, error } = await supabase.storage
      .from('expert-certifications')
      .upload(fileName, testFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: testFile.type
      });
    
    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Upload successful:', data);
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('expert-certifications')
      .getPublicUrl(fileName);
    
    console.log('Public URL:', publicUrlData.publicUrl);
    
    // Test downloading the file
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('expert-certifications')
      .download(fileName);
    
    if (downloadError) {
      console.error('Download error:', downloadError);
    } else {
      console.log('Download successful, file size:', downloadData.size);
      const text = await downloadData.text();
      console.log('Downloaded content:', text);
    }
    
    return { success: true, url: publicUrlData.publicUrl };
    
  } catch (error: any) {
    console.error('Test failed:', error);
    return { success: false, error: error.message };
  }
} 