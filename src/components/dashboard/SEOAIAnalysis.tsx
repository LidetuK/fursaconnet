import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface SEOAIAnalysisProps {
  type: 'keyword' | 'content' | 'audit' | 'competitor';
  input: string;
  onAnalysisComplete: (data: any) => void;
}

const SEOAIAnalysis = ({ type, input, onAnalysisComplete }: SEOAIAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // API Keys
  const DEEPSEEK_API_KEY = "sk-7c6a8a160ab646be9e19793ba72812f4";
  const GEMINI_API_KEY = "AIzaSyBXbgo0a-G93GK-SN697CTgstGsblAmO7s";

  // Function to call DeepSeek API
  const callDeepSeek = async (prompt: string) => {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO analyst. Provide detailed, accurate, and actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Function to call Gemini API
  const callGemini = async (prompt: string) => {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topK: 40,
          topP: 0.95
        }
      })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const analyzeKeyword = async () => {
    const prompt = `Analyze the keyword "${input}" and provide:
      1. Related keywords with search volume estimates
      2. Keyword difficulty scores
      3. Cost per click estimates
      4. Content opportunities
      Format the response as a JSON array of objects with properties: keyword, volume, difficulty, cpc, opportunity`;

    const response = await callDeepSeek(prompt);
    return JSON.parse(response);
  };

  const analyzeContent = async () => {
    const prompt = `Analyze the content at ${input} and provide a detailed SEO analysis in the following format:
      {
        "score": "A number between 0-100 representing content quality",
        "keywords": ["List of suggested keywords to target"],
        "technical": ["List of technical SEO improvements"],
        "structure": ["List of content structure recommendations"]
      }
      Be specific and actionable in your recommendations.`;

    const response = await callGemini(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {
      score: "70",
      keywords: ["Extract keywords from response"],
      technical: ["Check technical SEO aspects"],
      structure: ["Review content structure"]
    };
  };

  const analyzeSite = async () => {
    const prompt = `Perform a comprehensive SEO audit of ${input} and provide:
      1. Technical SEO issues
      2. On-page SEO issues
      3. Performance issues
      4. Mobile optimization issues
      Format the response as a JSON object with properties: technical, onpage, performance, mobile`;

    const response = await callDeepSeek(prompt);
    return JSON.parse(response);
  };

  const analyzeCompetitors = async () => {
    const prompt = `Analyze competitors for the keyword "${input}" and provide:
      1. Top competitors
      2. Their ranking factors
      3. Content strategies
      4. Backlink profiles
      Format the response as a JSON object with properties: competitors, rankingFactors, contentStrategies, backlinks`;

    const response = await callGemini(prompt);
    return JSON.parse(response);
  };

  const performAnalysis = async () => {
    if (!input) {
      toast({
        title: "Error",
        description: "Please provide input for analysis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      switch (type) {
        case 'keyword':
          result = await analyzeKeyword();
          break;
        case 'content':
          result = await analyzeContent();
          break;
        case 'audit':
          result = await analyzeSite();
          break;
        case 'competitor':
          result = await analyzeCompetitors();
          break;
      }
      onAnalysisComplete(result);
      toast({
        title: "Success",
        description: "Analysis completed successfully",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to perform analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={performAnalysis}
      disabled={isLoading}
      className="bg-skilllink-green hover:bg-skilllink-dark-green text-white px-4 py-2 rounded-md flex items-center"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze with AI'
      )}
    </button>
  );
};

export default SEOAIAnalysis; 