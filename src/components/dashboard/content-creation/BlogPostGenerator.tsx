
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FeatureExplanation from './FeatureExplanation';
import BlogPostForm from './blog-post/BlogPostForm';
import GeneratedContent from './blog-post/GeneratedContent';
import ContentTable from './blog-post/ContentTable';

interface BlogPostGeneratorProps {
  packageType: string;
}

const BlogPostGenerator = ({ packageType }: BlogPostGeneratorProps) => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBlogTitle, setCurrentBlogTitle] = useState("");
  const { toast } = useToast();

  // Function to generate blog content using HuggingFace API via Supabase edge function
  const generateBlogContent = async (blogData: {
    title: string;
    tone: string;
    length: string;
    keywords: string;
    outline: string;
    seoOptimized: boolean;
  }) => {
    setIsGenerating(true);
    setCurrentBlogTitle(blogData.title);

    try {
      const prompt = `Create a ${blogData.length} blog post about "${blogData.title}" with a ${blogData.tone} tone. ${
        blogData.keywords ? `Include these keywords: ${blogData.keywords}.` : ""
      } ${blogData.outline ? `Include these key points: ${blogData.outline}.` : ""} ${
        blogData.seoOptimized ? "Optimize the content for SEO." : ""
      }`;

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

      const generatedText = data?.data?.generated_text || data?.data?.[0]?.generated_text || "";
      setGeneratedContent(generatedText);
      
      if (!generatedText) {
        toast({
          title: "Empty Response",
          description: "Received an empty response from the API. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error generating content:", err);
      toast({
        title: "Error",
        description: "Failed to generate blog content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock saved content
  const savedContent = [
    {
      title: "10 Tips for Improving Your Website's SEO",
      type: "Blog Post",
      status: "Published",
      date: "June 5, 2023",
      views: 254,
    },
    {
      title: "How We Increased Client Conversions by 45%",
      type: "Case Study",
      status: "Draft",
      date: "Last edited June 8, 2023",
      views: null,
    },
    {
      title: "Ultimate Guide to Social Media Marketing",
      type: "Guide",
      status: "Scheduled",
      date: "Scheduled for June 15, 2023",
      views: null,
    },
  ];

  const handleSaveAsDraft = () => {
    // Add to saved content
    const newContent = {
      title: currentBlogTitle,
      type: "Blog Post",
      status: "Draft",
      date: "Last edited " + new Date().toLocaleDateString(),
      views: null,
    };
    // In a real app, you would update state or send to API
    console.log("Adding content:", newContent);
    toast({
      title: "Saved",
      description: "Blog post saved as draft",
    });
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Blog Post Generator</CardTitle>
            <CardDescription>
              Create engaging blog posts with AI assistance
            </CardDescription>
          </div>
          <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
            New Blog Post
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature explanation for blog post generator */}
        <FeatureExplanation 
          title="AI Blog Post Generator"
          description="Enter a title, select your preferred tone and length, add keywords, and let our AI create a complete blog post for you. You can also include key points you want covered and optimize for SEO."
          amharicDescription="አርእስት ያስገቡ፣ የሚፈልጉትን ድምጽ እና ርዝመት ይምረጡ፣ ቁልፍ ቃላትን ያክሉ፣ እና የእኛ AI ሙሉ የብሎግ ልጥፍ እንዲፈጥርልዎ ይፍቀዱለት። እንዲሁም መሸፈን የሚፈልጓቸውን ቁልፍ ነጥቦች ማካተት እና ለSEO ማስተካከል ይችላሉ።"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              AI Blog Post Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BlogPostForm 
              onGenerate={generateBlogContent}
              isGenerating={isGenerating}
              packageType={packageType}
            />
          </CardContent>
        </Card>

        {generatedContent && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Generated Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeneratedContent 
                content={generatedContent}
                blogTitle={currentBlogTitle}
                onSaveAsDraft={handleSaveAsDraft}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </CardContent>
          </Card>
        )}

        <ContentTable content={savedContent} />
      </CardContent>
    </Card>
  );
};

export default BlogPostGenerator;
