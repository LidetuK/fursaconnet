
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface BlogPostFormProps {
  onGenerate: (blogData: {
    title: string;
    tone: string;
    length: string;
    keywords: string;
    outline: string;
    seoOptimized: boolean;
  }) => Promise<void>;
  isGenerating: boolean;
  packageType: string;
}

const BlogPostForm = ({ onGenerate, isGenerating, packageType }: BlogPostFormProps) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogTone, setBlogTone] = useState("professional");
  const [blogLength, setBlogLength] = useState("medium");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogOutline, setBlogOutline] = useState("");
  const [seoOptimized, setSeoOptimized] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!blogTitle) {
      setError("Please enter a title for your blog post");
      return;
    }

    setError("");
    try {
      await onGenerate({
        title: blogTitle,
        tone: blogTone,
        length: blogLength,
        keywords: blogKeywords,
        outline: blogOutline,
        seoOptimized
      });
    } catch (err) {
      console.error("Error in form submission:", err);
      setError("Failed to generate content. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate blog content. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="blog-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Blog Post Title
        </label>
        <Input
          id="blog-title"
          placeholder="E.g., 10 Ways to Improve Your Social Media Strategy"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="blog-tone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tone
          </label>
          <select
            id="blog-tone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
            value={blogTone}
            onChange={(e) => setBlogTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="conversational">Conversational</option>
            <option value="authoritative">Authoritative</option>
            <option value="educational">Educational</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="blog-length"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Length
          </label>
          <select
            id="blog-length"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
            value={blogLength}
            onChange={(e) => setBlogLength(e.target.value)}
          >
            <option value="short">Short (500-700 words)</option>
            <option value="medium">Medium (800-1200 words)</option>
            <option value="long">Long (1500+ words)</option>
            {packageType === "enterprise" && (
              <option value="comprehensive">
                Comprehensive (2500+ words)
              </option>
            )}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="blog-keywords"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Keywords (separated by commas)
        </label>
        <Input
          id="blog-keywords"
          placeholder="E.g., social media, marketing strategy, engagement"
          value={blogKeywords}
          onChange={(e) => setBlogKeywords(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="blog-outline"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Key Points (optional)
        </label>
        <textarea
          id="blog-outline"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
          placeholder="List any specific points you want to include in your blog post"
          value={blogOutline}
          onChange={(e) => setBlogOutline(e.target.value)}
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          id="seo-optimized"
          type="checkbox"
          className="h-4 w-4 text-skilllink-green focus:ring-skilllink-green border-gray-300 rounded"
          checked={seoOptimized}
          onChange={(e) => setSeoOptimized(e.target.checked)}
        />
        <label
          htmlFor="seo-optimized"
          className="ml-2 block text-sm text-gray-700"
        >
          Optimize for SEO
        </label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Blog Post"}
      </Button>
    </div>
  );
};

export default BlogPostForm;
