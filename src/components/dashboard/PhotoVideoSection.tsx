import { useState } from "react";
import {
  Camera,
  Video,
  Play,
  MessageCircle,
  Image,
  Monitor,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionChatbot from "@/components/dashboard/SectionChatbot";
import { InferenceClient } from "@huggingface/inference";

// Initialize the Hugging Face client with your API token
const client = new InferenceClient(import.meta.env.VITE_HUGGING_FACE_API_TOKEN);

// Image generation function
async function generateImage(prompt: string) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY || ""}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted, disfigured",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error in image generation:", error);
    throw error;
  }
}

interface PhotoVideoSectionProps {
  packageType: string;
}

const PhotoVideoSection = ({ packageType }: PhotoVideoSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<Blob | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Mock image ideas
  const imageIdeas = [
    {
      title: "Professional Team Photo",
      description:
        "Our team collaborating in a modern office environment, demonstrating teamwork and professionalism.",
      generated: "/lovable-uploads/122a4c0d-7dd9-482e-a530-eac1e2369f7b.png",
    },
    {
      title: "Product Showcase",
      description:
        "A sleek display of our digital product on multiple devices, highlighting the responsive design.",
      generated: "/lovable-uploads/ae8add71-e9e6-4cec-9f7c-18708428912a.png",
    },
    {
      title: "Client Meeting",
      description:
        "A professional consultation with a client, showing our expert guidance and attention to detail.",
      generated: "/lovable-uploads/istockphoto-1395187689-612x612.jpg",
    },
  ];

  // Mock video templates
  const videoTemplates = [
    {
      title: "Client Testimonial",
      description:
        "A brief video featuring a satisfied client discussing their positive experience with your services.",
      duration: "30-60 seconds",
      scenes: [
        "Introduction",
        "Problem Statement",
        "Solution Overview",
        "Results",
        "Recommendation",
      ],
    },
    {
      title: "Product Demonstration",
      description:
        "Show your product in action, highlighting key features and benefits.",
      duration: "1-2 minutes",
      scenes: [
        "Product Introduction",
        "Problem It Solves",
        "Key Features",
        "How It Works",
        "Call to Action",
      ],
    },
    {
      title: "Company Overview",
      description:
        "A comprehensive look at your company, including mission, services, and team.",
      duration: "2-3 minutes",
      scenes: [
        "Company Introduction",
        "Mission & Values",
        "Services Overview",
        "Team Highlights",
        "Client Success Stories",
        "Contact Information",
      ],
    },
    {
      title: "How-To Tutorial",
      description:
        "Step-by-step guide teaching viewers how to accomplish a specific task related to your services.",
      duration: "3-5 minutes",
      scenes: [
        "Introduction",
        "Materials/Tools Needed",
        "Step 1-5",
        "Common Mistakes",
        "Final Tips",
        "Conclusion",
      ],
    },
  ];

  // Function to handle image generation
  const handleImageGeneration = async () => {
    if (!imagePrompt) {
      setError("Please enter a description for the image");
      return;
    }

    setIsGeneratingImage(true);
    setError("");

    try {
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);

      // Fallback to a placeholder image if the API fails
      setError("Using placeholder image due to API limitations.");
      setGeneratedImage("/placeholder.svg");

      // In a real application, you might want to use a more sophisticated fallback
      // or notify the user that the feature is temporarily unavailable
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Function to generate video
  const handleVideoGeneration = async () => {
    if (!videoPrompt) {
      setError("Please enter a description for the video");
      return;
    }

    setIsGeneratingVideo(true);
    setError("");

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: videoPrompt,
            parameters: {
              num_frames: 14,
              width: 576,
              height: 320,
              num_inference_steps: 25,
              min_guidance_scale: 1.0,
              max_guidance_scale: 3.0,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API request failed: ${errorData.error || response.statusText}`
        );
      }

      const videoBlob = await response.blob();
      setGeneratedVideo(videoBlob);
    } catch (err) {
      console.error("Error generating video:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate video. Please try again."
      );
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Photo & Video Production</h1>
          <p className="text-gray-500">
            Create visual content for your marketing channels
          </p>
        </div>
        <button
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>Media Production Assistant</span>
        </button>
      </div>

      <Tabs defaultValue="image-creation" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="image-creation">
            <Image className="h-4 w-4 mr-2" />
            Image Creation
          </TabsTrigger>
          <TabsTrigger value="video-templates">
            <Video className="h-4 w-4 mr-2" />
            Video Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image-creation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Image Generator</CardTitle>
              <CardDescription>
                Create custom images for your marketing materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Generate Images with AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      htmlFor="image-prompt"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Image Description
                    </label>
                    <textarea
                      id="image-prompt"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      placeholder="Describe the image you want to create in detail..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="image-style"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Style
                      </label>
                      <select
                        id="image-style"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="realistic">Realistic</option>
                        <option value="artistic">Artistic</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="3d">3D Render</option>
                        <option value="flat">Flat Design</option>
                        <option value="minimalist">Minimalist</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="image-ratio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Aspect Ratio
                      </label>
                      <select
                        id="image-ratio"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="1:1">Square (1:1)</option>
                        <option value="4:3">Standard (4:3)</option>
                        <option value="16:9">Widescreen (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                        <option value="21:9">Ultra-wide (21:9)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="image-mood"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mood
                      </label>
                      <select
                        id="image-mood"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="professional">Professional</option>
                        <option value="happy">Happy/Upbeat</option>
                        <option value="serious">Serious</option>
                        <option value="creative">Creative</option>
                        <option value="calm">Calm</option>
                        <option value="energetic">Energetic</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="image-variations"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Variations
                      </label>
                      <select
                        id="image-variations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="1">1 image</option>
                        <option value="2">2 images</option>
                        <option value="4">4 images</option>
                        {packageType === "enterprise" && (
                          <option value="8">8 images</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <Button
                    className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                    onClick={handleImageGeneration}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Image"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {generatedImage && (
                <div className="mt-4">
                  <h3 className="font-medium text-lg mb-4">Generated Image</h3>
                  <div className="border border-gray-200 rounded-md p-4">
                    <img
                      src={generatedImage}
                      alt="Generated content"
                      className="max-w-full h-auto rounded-md"
                    />
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // In a real app, you would save the image
                          console.log("Using generated image");
                        }}
                      >
                        Use Image
                      </Button>
                      <Button
                        className="flex-1 bg-skilllink-green hover:bg-skilllink-dark-green"
                        onClick={() => {
                          // Create a download link
                          const link = document.createElement("a");
                          link.href = generatedImage;
                          link.download = "generated-image.png";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {packageType !== "enterprise" && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Advanced Image Features
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Upgrade to{" "}
                        {packageType === "starter"
                          ? "Professional"
                          : "Enterprise"}{" "}
                        for access to advanced image generation features,
                        including higher resolution images, more variation
                        options, and brand consistency controls.
                      </p>
                      <Button className="mt-3 bg-skilllink-green hover:bg-skilllink-dark-green">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video-templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Production</CardTitle>
              <CardDescription>
                Create professional videos using AI-assisted templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Video Script Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      htmlFor="video-title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Video Title
                    </label>
                    <Input
                      id="video-title"
                      placeholder="E.g., How Our SEO Services Can Boost Your Website Traffic"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="video-type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Video Type
                      </label>
                      <select
                        id="video-type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="explainer">Explainer Video</option>
                        <option value="testimonial">Client Testimonial</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="product-demo">Product Demo</option>
                        <option value="company-intro">
                          Company Introduction
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="video-duration"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Target Duration
                      </label>
                      <select
                        id="video-duration"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      >
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="120">2 minutes</option>
                        <option value="180">3 minutes</option>
                        <option value="300">5 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="video-content"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Key Points to Cover
                    </label>
                    <textarea
                      id="video-content"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                      placeholder="List the main points you want to include in your video"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="video-tone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tone
                    </label>
                    <select
                      id="video-tone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                    >
                      <option value="professional">Professional</option>
                      <option value="conversational">Conversational</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="educational">Educational</option>
                      <option value="humorous">Humorous</option>
                    </select>
                  </div>

                  <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                    Generate Script
                  </Button>
                </CardContent>
              </Card>

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Video Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoTemplates.map((template, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">
                            {template.title}
                          </CardTitle>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {template.duration}
                          </span>
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Scene Breakdown:
                          </h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                            {template.scenes.map((scene, i) => (
                              <li key={i}>{scene}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full bg-skilllink-green hover:bg-skilllink-dark-green flex items-center gap-2"
                          onClick={() => {
                            setVideoPrompt(template.description);
                            handleVideoGeneration();
                          }}
                        >
                          <Play size={16} />
                          <span>Generate Script</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {packageType === "starter" && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Advanced Video Features
                      </h4>
                      <p className="text-sm text-blue-600 mt-1">
                        Upgrade to Professional or Enterprise for access to
                        advanced video features, including AI-generated video
                        clips, animations, and professional voiceovers.
                      </p>
                      <Button className="mt-3 bg-skilllink-green hover:bg-skilllink-dark-green">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-medium text-lg mb-4">Generate Video</h3>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Video Generator</CardTitle>
                    <CardDescription>
                      Create custom videos using AI technology
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label
                        htmlFor="video-prompt"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Video Description
                      </label>
                      <textarea
                        id="video-prompt"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green"
                        placeholder="Describe the video you want to create..."
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                      ></textarea>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <Button
                      className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                      onClick={handleVideoGeneration}
                      disabled={isGeneratingVideo}
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Video"
                      )}
                    </Button>

                    {generatedVideo && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Generated Video:</h4>
                        <video
                          controls
                          className="w-full rounded-lg"
                          src={URL.createObjectURL(generatedVideo)}
                        />
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              // Create a download link
                              const link = document.createElement("a");
                              link.href = URL.createObjectURL(generatedVideo);
                              link.download = "generated-video.mp4";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Download Video
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Chatbot */}
      <SectionChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        sectionTitle="Photo & Video Production"
        apiKey={import.meta.env.VITE_HF_API_KEY || ""}
        apiType="gemini"
      />
    </div>
  );
};

export default PhotoVideoSection;
