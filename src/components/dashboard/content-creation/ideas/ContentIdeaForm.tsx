
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContentIdeaFormProps {
  onGenerate: (ideaData: {
    topicArea: string;
    contentType: string;
    audience: string;
    ideaKeywords: string;
    numIdeas: string;
  }) => Promise<void>;
  isGenerating: boolean;
}

const ContentIdeaForm = ({ onGenerate, isGenerating }: ContentIdeaFormProps) => {
  const [topicArea, setTopicArea] = useState("");
  const [contentType, setContentType] = useState("any");
  const [audience, setAudience] = useState("");
  const [ideaKeywords, setIdeaKeywords] = useState("");
  const [numIdeas, setNumIdeas] = useState("5");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topicArea) {
      setError("Please enter a topic area");
      return;
    }

    setError("");
    try {
      await onGenerate({
        topicArea,
        contentType,
        audience,
        ideaKeywords,
        numIdeas
      });
    } catch (err) {
      console.error("Error in form submission:", err);
      setError("Failed to generate ideas. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="topic-area"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Topic Area
          </label>
          <Input
            id="topic-area"
            placeholder="E.g., Digital Marketing"
            value={topicArea}
            onChange={(e) => setTopicArea(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="content-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content Type (Optional)
          </label>
          <select
            id="content-type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="any">Any Type</option>
            <option value="blog post">Blog Post</option>
            <option value="social media">Social Media</option>
            <option value="video">Video</option>
            <option value="podcast">Podcast</option>
            <option value="infographic">Infographic</option>
            <option value="case study">Case Study</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="audience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Target Audience (Optional)
          </label>
          <Input
            id="audience"
            placeholder="E.g., Small Business Owners"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Keywords/Themes (Optional)
          </label>
          <Input
            id="keywords"
            placeholder="E.g., trends, strategy, growth"
            value={ideaKeywords}
            onChange={(e) => setIdeaKeywords(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="num-ideas"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Number of Ideas
        </label>
        <select
          id="num-ideas"
          className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
          value={numIdeas}
          onChange={(e) => setNumIdeas(e.target.value)}
        >
          <option value="3">3 Ideas</option>
          <option value="5">5 Ideas</option>
          <option value="10">10 Ideas</option>
        </select>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        onClick={handleGenerate}
        className="bg-skilllink-green hover:bg-skilllink-dark-green"
        disabled={isGenerating}
      >
        {isGenerating ? "Generating Ideas..." : "Generate Content Ideas"}
      </Button>
    </div>
  );
};

export default ContentIdeaForm;
