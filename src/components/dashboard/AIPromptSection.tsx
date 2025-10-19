
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Zap } from 'lucide-react';

interface AIPromptSectionProps {
  title: string;
  description: string;
  placeholder: string;
  buttonText?: string;
  handleGenerateContent: (prompt: string) => Promise<any>;
}

const AIPromptSection: React.FC<AIPromptSectionProps> = ({
  title,
  description,
  placeholder,
  buttonText = "Generate",
  handleGenerateContent
}) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate content.",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const generatedContent = await handleGenerateContent(prompt);
      setResult(generatedContent);
      toast({
        title: "Generated successfully",
        description: "Your content has been generated."
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your content.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-skilllink-green" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-skilllink-dark-gray mb-4">{description}</p>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder={placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 mb-4"
              disabled={generating}
            />
            <Button
              type="submit"
              className="bg-skilllink-green hover:bg-skilllink-dark-green"
              disabled={generating || !prompt.trim()}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {buttonText}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
            >
              Clear Result
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AIPromptSection;
