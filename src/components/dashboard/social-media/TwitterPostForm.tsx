
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UnifiedPostForm = () => {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handlePost = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please enter some content to post.",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch('https://fursaconnet-production.up.railway.app/auth/twitter2/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: postContent }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post tweet');
      }
      toast({
        title: "Post sent!",
        description: "Your tweet has been published successfully."
      });
      setPostContent('');
      setIsPosting(false);
    } catch (error: any) {
      toast({
        title: "Failed to post",
        description: error.message || "There was an error posting your content.",
        variant: "destructive"
      });
      setIsPosting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Twitter className="h-5 w-5" />
          Quick Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What's happening?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={4}
          maxLength={280}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {postContent.length}/280
          </span>
          <Button
            onClick={handlePost}
            disabled={!postContent.trim() || isPosting}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedPostForm;
