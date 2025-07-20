
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2 } from 'lucide-react';

const ContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate content generation
    setTimeout(() => {
      setGeneratedContent(`🚀 Exciting news about ${topic}! 

Our team is passionate about delivering exceptional results in ${topic}. Here's what makes us different:

✨ Innovation-driven approach
🎯 Results-focused strategy  
🤝 Client-centric solutions
📈 Proven track record

Ready to take your ${topic} to the next level? Let's connect!

#${topic.replace(/\s+/g, '')} #DigitalTransformation #Success`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., web development, digital marketing, SEO"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="tone">Tone</Label>
          <select
            id="tone"
            className="w-full p-2 border rounded-md"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="educational">Educational</option>
          </select>
        </div>
        
        <Button 
          onClick={generateContent}
          disabled={!topic.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </Button>
        
        {generatedContent && (
          <div>
            <Label>Generated Content</Label>
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={8}
              className="mt-2"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentGenerator;
