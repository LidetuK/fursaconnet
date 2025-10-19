import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useSocialMediaConnections } from '@/hooks/useSocialMediaConnections';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSocialAccounts } from '@/hooks/social/useSocialAccounts';

const SocialMediaPostSection = () => {
  const { socialAccounts } = useSocialAccounts();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const MAX_IMAGE_SIZE_MB = 5;
  const [linkedinOrganizations, setLinkedinOrganizations] = useState<{ urn: string, id: string, name: string }[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('personal');

  useEffect(() => {
    if (selectedPlatform === 'linkedin') {
      // Fetch organizations from backend
      fetch('https://fursaconnet-production.up.railway.app/auth/linkedin/organizations', {
        method: 'GET',
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.organizations)) {
            setLinkedinOrganizations(data.organizations);
          } else {
            setLinkedinOrganizations([]);
          }
        })
        .catch(() => setLinkedinOrganizations([]));
    } else {
      setLinkedinOrganizations([]);
      setSelectedOrganization('personal');
    }
  }, [selectedPlatform]);

  // Only show platforms that are connected in the backend
  const connected = socialAccounts;

  if (connected.length === 0) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const validFiles: File[] = [];
      const previews: string[] = [];
      for (const file of filesArr) {
        if (!file.type.startsWith('image/')) {
          toast({ title: 'Invalid file', description: `${file.name} is not an image.`, variant: 'destructive' });
          continue;
        }
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          toast({ title: 'File too large', description: `${file.name} exceeds ${MAX_IMAGE_SIZE_MB}MB.`, variant: 'destructive' });
          continue;
        }
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
      setImages(validFiles);
      setImagePreviews(previews);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePost = async () => {
    if (!selectedPlatform) {
      toast({ title: "Select a platform", description: "Please select a connected platform to post to.", variant: "destructive" });
      return;
    }
    if (!postText.trim()) {
      toast({ title: "Empty post", description: "Please enter some text to post.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (selectedPlatform === 'twitter') {
        const response = await fetch('https://fursaconnet-production.up.railway.app/auth/twitter2/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ text: postText }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to post to Twitter');
        }
        toast({ title: "Posted!", description: "Your post was sent to Twitter." });
        setPostText('');
      } else if (selectedPlatform === 'linkedin') {
        if (!user) throw new Error('You must be logged in to post to LinkedIn.');
        // Use FormData for images + text only (no organizationUrn)
        const formData = new FormData();
        formData.append('text', postText);
        images.forEach((img, idx) => formData.append('images', img));
        // Do NOT append organizationUrn, always post as personal
        const response = await fetch('https://fursaconnet-production.up.railway.app/auth/linkedin/post', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to post to LinkedIn');
        }
        toast({ title: "Posted!", description: "Your post was sent to LinkedIn." });
        setPostText('');
        setImages([]);
      } else {
        toast({ title: "Not implemented", description: "Posting to this platform is not yet supported.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Post failed", description: error.message || "Failed to post.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 mt-8">
      <CardHeader>
        <CardTitle>Post to Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 font-medium">Choose platform:</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
            >
              <option value="">Select a platform</option>
              {connected.map(acc => (
                <option key={acc.platform} value={acc.platform}>
                  {acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Your post:</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="What's happening?"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Upload image(s):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mb-2"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((img, idx) => (
                  <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">{img.name}</span>
                ))}
              </div>
            )}
          </div>
          {selectedPlatform === 'linkedin' && linkedinOrganizations.length > 0 && (
            <div>
              <label className="block mb-2 font-medium">Post as:</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedOrganization}
                onChange={e => setSelectedOrganization(e.target.value)}
              >
                <option value="personal">Personal Profile</option>
                {linkedinOrganizations.map(org => (
                  <option key={org.urn} value={org.urn}>
                    {org.name ? `${org.name} (ID: ${org.id})` : org.urn}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button onClick={handlePost} disabled={loading || !selectedPlatform || !postText.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-full rounded border" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaPostSection; 
