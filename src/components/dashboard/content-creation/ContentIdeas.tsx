
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FeatureExplanation from './FeatureExplanation';
import ContentIdeaForm from './ideas/ContentIdeaForm';
import ContentIdeaGrid from './ideas/ContentIdeaGrid';

interface ContentIdea {
  title: string;
  type: string;
  audience: string;
  difficulty: string;
  potential: string;
}

const ContentIdeas = () => {
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const { toast } = useToast();

  // Function to generate content ideas using HuggingFace API via Supabase edge function
  const generateContentIdeas = async (ideaData: {
    topicArea: string;
    contentType: string;
    audience: string;
    ideaKeywords: string;
    numIdeas: string;
  }) => {
    setIsGeneratingIdeas(true);

    try {
      const prompt = `Generate ${ideaData.numIdeas} creative content ideas about "${ideaData.topicArea}" for ${
        ideaData.contentType !== "any" ? ideaData.contentType : "any content type"
      }. ${ideaData.audience ? `Target audience: ${ideaData.audience}.` : ""} ${
        ideaData.ideaKeywords ? `Include these keywords or themes: ${ideaData.ideaKeywords}.` : ""
      } For each idea, provide a title, content type, target audience, difficulty level (Low/Medium/High), and potential impact (Low/Medium/High).`;

      const { data, error } = await supabase.functions.invoke('huggingface-api', {
        body: {
          prompt,
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          task: "text-generation"
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Parse the response into structured data
      const response = data?.data?.generated_text || data?.data?.[0]?.generated_text || "";

      // Simple parsing - in a real app, you'd want more robust parsing
      const ideasText = response.split("\n\n");
      const parsedIdeas = ideasText
        .filter((text) => text.trim().length > 0)
        .map((text) => {
          // Extract title (assuming it's the first line)
          const lines = text.split("\n");
          const title = lines[0].replace(/^\d+\.\s*/, "").trim();

          // Extract other fields with simple regex
          const typeMatch = text.match(/Type:\s*([^\n]+)/i);
          const audienceMatch = text.match(/Audience:\s*([^\n]+)/i);
          const difficultyMatch = text.match(/Difficulty:\s*([^\n]+)/i);
          const potentialMatch = text.match(/Potential:\s*([^\n]+)/i);

          return {
            title,
            type: typeMatch ? typeMatch[1].trim() : "Content",
            audience: audienceMatch ? audienceMatch[1].trim() : "General",
            difficulty: difficultyMatch ? difficultyMatch[1].trim() : "Medium",
            potential: potentialMatch ? potentialMatch[1].trim() : "Medium",
          };
        });

      setGeneratedIdeas(parsedIdeas);
      
      if (parsedIdeas.length === 0) {
        toast({
          title: "Parsing Error",
          description: "Could not parse content ideas from the response. Showing default ideas instead.",
          variant: "destructive"
        });
      }

    } catch (err) {
      console.error("Error generating content ideas:", err);
      toast({
        title: "Error",
        description: "Failed to generate content ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // Mock content ideas - will be replaced by generated ideas
  const contentIdeas =
    generatedIdeas.length > 0
      ? generatedIdeas
      : [
          {
            title: "The Future of Digital Marketing in 2025",
            type: "Trend Analysis",
            audience: "Business Owners, Marketers",
            difficulty: "Medium",
            potential: "High",
          },
          {
            title: "5 Ways to Optimize Your Website for Voice Search",
            type: "How-To Guide",
            audience: "SEO Specialists, Business Owners",
            difficulty: "Low",
            potential: "Medium",
          },
          {
            title: "Understanding the Impact of AI on Content Creation",
            type: "Industry Analysis",
            audience: "Content Creators, Marketers",
            difficulty: "Medium",
            potential: "High",
          },
        ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Ideas Generator</CardTitle>
        <CardDescription>
          Generate creative content ideas for your marketing strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeatureExplanation 
          title="Content Ideas Generator"
          description="Not sure what to create? Our AI can help generate fresh content ideas based on your topic, target audience, and keywords."
          amharicDescription="ምን መፍጠር እንዳለብዎት እርግጠኛ አይደሉም? የእኛ AI በርዕስዎ፣ በዒላማ ታዳሚዎ እና በቁልፍ ቃላት ላይ በመመስረት አዲስ የይዘት ሀሳቦችን እንዲያመነጭ ሊረዳዎት ይችላል።"
        />

        <div className="space-y-4 mt-4">
          <ContentIdeaForm
            onGenerate={generateContentIdeas}
            isGenerating={isGeneratingIdeas}
          />

          {contentIdeas.length > 0 && (
            <ContentIdeaGrid ideas={contentIdeas} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentIdeas;
