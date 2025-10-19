import { useState } from 'react';
import { Search, FileText, Heading1, ExternalLink, List, MessageCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionChatbot from './SectionChatbot';
import SEOAIAnalysis from './SEOAIAnalysis';
import { useToast } from "@/hooks/use-toast";

// Feature explanation component
const FeatureExplanation = ({ title, description, amharicDescription }: { title: string, description: string, amharicDescription: string }) => (
  <div className="bg-white border border-gray-200 rounded-md p-4 mb-4 shadow-sm">
    <h3 className="font-medium text-lg mb-2 text-skilllink-green">{title}</h3>
    <div className="space-y-2">
      <p className="text-gray-700">{description}</p>
      <div className="pt-2 border-t border-gray-100">
        <p className="text-gray-700 font-medium text-sm">በአማርኛ:</p>
        <p className="text-gray-700 text-sm">{amharicDescription}</p>
      </div>
    </div>
  </div>
);

interface SEOSectionProps {
  packageType: string;
}

interface SEOIssue {
  issue: string;
  count: number;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

const SEOSection = ({ packageType }: SEOSectionProps) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const { toast } = useToast();
  
  // Mock data
  const keywordSuggestions = [
    { keyword: "web design services", volume: 12500, difficulty: "Medium", cpc: "$12.45" },
    { keyword: "digital marketing company", volume: 6700, difficulty: "High", cpc: "$24.30" },
    { keyword: "affordable website builder", volume: 9200, difficulty: "Low", cpc: "$8.75" },
    { keyword: "local SEO company", volume: 4300, difficulty: "Medium", cpc: "$18.50" },
    { keyword: "responsive website templates", volume: 8100, difficulty: "Low", cpc: "$5.25" },
  ];
  
  // SEO issues with suggestions added
  const seoIssues: SEOIssue[] = [
    { 
      issue: "Missing meta descriptions", 
      count: 12, 
      severity: "high",
      suggestion: "Add unique, descriptive meta descriptions to each page that include your target keywords and a compelling call to action."
    },
    { 
      issue: "Slow page load speed", 
      count: 8, 
      severity: "high",
      suggestion: "Optimize images, enable browser caching, minify CSS/JS files, and consider using a content delivery network (CDN)."
    },
    { 
      issue: "Missing alt tags", 
      count: 24, 
      severity: "medium",
      suggestion: "Add descriptive alt text to all images that includes relevant keywords when appropriate."
    },
    { 
      issue: "Duplicate content", 
      count: 3, 
      severity: "high",
      suggestion: "Use canonical tags to specify the preferred version of duplicate pages, or rewrite content to make it unique."
    },
    { 
      issue: "Broken links", 
      count: 6, 
      severity: "medium",
      suggestion: "Regularly check for and fix broken links. Consider setting up custom 404 pages and redirects for deleted content."
    },
    { 
      issue: "Poor mobile optimization", 
      count: 5, 
      severity: "high",
      suggestion: "Implement responsive design, ensure text is readable without zooming, and make sure tap targets are appropriately sized."
    },
    { 
      issue: "No XML sitemap", 
      count: 1, 
      severity: "medium",
      suggestion: "Generate an XML sitemap and submit it to Google Search Console to help search engines discover and index your content."
    },
    { 
      issue: "Low word count", 
      count: 9, 
      severity: "low",
      suggestion: "Expand thin content pages by adding more comprehensive, valuable information that addresses user intent."
    },
  ];
  
  const competitorInsights = [
    { 
      competitor: "Company A", 
      ranking: 1, 
      topKeywords: ["web design", "web development", "UI/UX design"],
      backlinks: 2450,
      domainAuthority: 76
    },
    { 
      competitor: "Company B", 
      ranking: 2, 
      topKeywords: ["affordable websites", "small business web design", "local web development"],
      backlinks: 1850,
      domainAuthority: 68
    },
    { 
      competitor: "Company C", 
      ranking: 3, 
      topKeywords: ["enterprise web solutions", "e-commerce development", "web applications"],
      backlinks: 3100,
      domainAuthority: 72
    },
  ];

  const contentAnalysis = {
    score: 85,
    keywords: [
      "web development",
      "responsive design",
      "user experience",
      "mobile optimization",
      "performance optimization"
    ],
    technical: [
      "Improve page load speed",
      "Add schema markup",
      "Optimize images",
      "Fix broken links",
      "Implement proper heading structure"
    ],
    structure: [
      "Add more internal links",
      "Include more subheadings",
      "Add a table of contents",
      "Include more examples",
      "Add a FAQ section"
    ]
  };

  const runAudit = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to audit",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunningAudit(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRunningAudit(false);
      setAuditCompleted(true);
      toast({
        title: "Success",
        description: "Site audit completed successfully",
      });
    }, 2000);
  };

  const handleAnalysisComplete = (data: any) => {
    console.log("Analysis complete:", data);
    // Handle the analysis data
    toast({
      title: "Success",
      description: "Analysis completed successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SEO Optimization</h1>
          <p className="text-gray-500">Improve your search engine visibility and organic traffic</p>
        </div>
        <button 
          onClick={() => setChatbotOpen(true)}
          className="flex items-center space-x-2 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
        >
          <MessageCircle size={18} />
          <span>SEO Assistant</span>
        </button>
      </div>

      {/* Feature explanation for new users */}
      <FeatureExplanation 
        title="SEO Optimization Tools"
        description="These tools help you improve your website's visibility in search engines. You can research keywords, optimize content, run site audits, and analyze competitors to boost your search rankings."
        amharicDescription="እነዚህ መሳሪያዎች ድረ-ገፅዎ በፍለጋ ሞተሮች ውስጥ ታይነቱን እንዲያሻሽሉ ይረዳዎታል። የፍለጋ ቃላትን መመራመር፣ ይዘትን ማስተካከል፣ የጣቢያ ኦዲት ማድረግ፣ እና ተወዳዳሪዎችን ለመተንተን ፍለጋዎችዎን ለማሳደግ ይችላሉ።"
      />
      
      <Tabs defaultValue="keyword-research" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="keyword-research">
            <Search className="h-4 w-4 mr-2" />
            Keyword Research
          </TabsTrigger>
          <TabsTrigger value="content-optimization">
            <FileText className="h-4 w-4 mr-2" />
            Content Optimization
          </TabsTrigger>
          <TabsTrigger value="site-audit">
            <List className="h-4 w-4 mr-2" />
            Site Audit
          </TabsTrigger>
          <TabsTrigger value="competitor-analysis">
            <ExternalLink className="h-4 w-4 mr-2" />
            Competitor Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="keyword-research" className="mt-6">
          {/* Feature explanation for keyword research */}
          <FeatureExplanation 
            title="Keyword Research"
            description="Find valuable keywords to target in your content. Enter a seed keyword to discover related terms, search volumes, competition levels, and cost per click estimates."
            amharicDescription="በይዘትዎ ውስጥ የሚያነጣጥሩባቸውን ዋጋ ያላቸው ቁልፍ ቃላትን ይፈልጉ። ተዛማጅ ውሎችን፣ የፍለጋ መጠኖችን፣ የውድድር ደረጃዎችን እና የጠቅታ ዋጋ ግምቶችን ለማግኘት ዋና ቁልፍ ቃል ያስገቡ።"
          />

          <Card>
            <CardHeader>
              <CardTitle>Keyword Research Tool</CardTitle>
              <CardDescription>Find valuable keywords to target in your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter a seed keyword
                  </label>
                  <Input 
                    type="text" 
                    id="keyword" 
                    placeholder="E.g., web design, digital marketing" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="self-end">
                  <Button className="bg-skilllink-green hover:bg-skilllink-dark-green h-10">
                    Find Keywords
                  </Button>
                </div>
              </div>
              
              {keyword && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Keyword Suggestions for "{keyword}"</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Volume</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {keywordSuggestions.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.keyword}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.volume}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${item.difficulty === "High" ? "bg-red-100 text-red-800" : 
                                 item.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                                 "bg-green-100 text-green-800"}`}>
                                {item.difficulty}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cpc}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button variant="outline" size="sm">Add to Campaign</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content-optimization" className="mt-6">
          {/* Feature explanation for content optimization */}
          <FeatureExplanation 
            title="Content Optimization"
            description="Analyze and optimize your content for better SEO performance. Enter a URL to get keyword suggestions, technical improvements, and content structure recommendations."
            amharicDescription="ለተሻለ SEO አፈጻጸም ይዘትዎን ይተንትኑ እና ያሻሽሉ። የቁልፍ ቃል ጥቆማዎችን፣ ቴክኒካዊ ማሻሻያዎችን እና የይዘት መዋቅር ምክሮችን ለማግኘት URL ያስገቡ።"
          />

          <Card>
            <CardHeader>
              <CardTitle>Content Optimization</CardTitle>
              <CardDescription>Analyze and optimize your content for better SEO performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="content-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Page URL
                  </label>
                  <div className="flex gap-4">
                    <Input 
                      id="content-url" 
                      placeholder="https://yourwebsite.com/page-to-analyze" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                      Analyze
                    </Button>
                  </div>
                </div>
                
                {url && (
                  <>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-lg mb-3">Content Quality Score: {contentAnalysis.score}/100</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium mb-2">Keyword Optimization</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                            {contentAnalysis.keywords.map((keyword, index) => (
                              <li key={index}>{keyword}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Technical Improvements</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                            {contentAnalysis.technical.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-medium text-lg mb-3">Content Structure Recommendations</h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                          {contentAnalysis.structure.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="site-audit" className="mt-6">
          {/* Feature explanation for site audit */}
          <FeatureExplanation 
            title="Site Audit"
            description="Identify and fix SEO issues on your website. Enter your website URL, run a comprehensive audit, and get actionable recommendations to improve your SEO health score."
            amharicDescription="በድረ-ገጽዎ ላይ ያሉ የSEO ችግሮችን ለይተው ያስተካክሉ። የድረ-ገጽዎን URL ያስገቡ፣ ሙሉ ኦዲት ያድርጉ፣ እና የSEO ጤና ውጤትዎን ለማሻሻል ተግባራዊ ምክሮችን ያግኙ።"
          />

          <Card>
            <CardHeader>
              <CardTitle>Site Audit</CardTitle>
              <CardDescription>Identify and fix SEO issues on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input 
                    type="text" 
                    placeholder="https://yourwebsite.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    className="bg-skilllink-green hover:bg-skilllink-dark-green"
                    onClick={runAudit}
                    disabled={isRunningAudit}
                  >
                    {isRunningAudit ? "Running..." : "Run Audit"}
                  </Button>
                  <SEOAIAnalysis 
                    type="audit" 
                    input={url} 
                    onAnalysisComplete={handleAnalysisComplete} 
                  />
                </div>
                
                {auditCompleted && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">SEO Health Score</h3>
                      <span className="text-2xl font-bold text-skilllink-green">68/100</span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Issues Found</h4>
                      <div className="space-y-3">
                        {seoIssues.map((issue, index) => (
                          <div 
                            key={index}
                            className="bg-white rounded border-l-4 border-solid shadow-sm overflow-hidden"
                            style={{ 
                              borderLeftColor: issue.severity === "high" ? "#ef4444" : 
                                              issue.severity === "medium" ? "#f59e0b" : "#F97415" 
                            }}
                          >
                            <div className="p-3 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {issue.severity === "high" ? (
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                  ) : issue.severity === "medium" ? (
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  )}
                                  <span className="font-medium">{issue.issue}</span>
                                </div>
                                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                                  Found on {issue.count} page{issue.count !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50">
                              <h5 className="text-sm font-medium mb-1">How to fix:</h5>
                              <p className="text-sm text-gray-700">{issue.suggestion}</p>
                            </div>
                            <div className="p-3 flex justify-end bg-white">
                              <Button variant="outline" size="sm">Fix Issue</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competitor-analysis" className="mt-6">
          {/* Feature explanation for competitor analysis */}
          <FeatureExplanation 
            title="Competitor Analysis"
            description="Track and analyze your competitors' SEO strategies. Enter your main keyword to discover who ranks for it, what keywords they target, and their backlink profiles."
            amharicDescription="የተወዳዳሪዎችዎን የSEO ስልቶች ይከታተሉ እና ይተንትኑ። ለዚያ የሚወጣውን፣ የሚያነጣጥሩበቸውን ቁልፍ ቃላት እና የኋላ አገናኝ መገለጫዎቻቸውን ለማግኘት ዋና ቁልፍ ቃልዎን ያስገቡ።"
          />

          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
              <CardDescription>Track and analyze your competitors' SEO strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input 
                    type="text" 
                    placeholder="Your main keyword (e.g., web development services)" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
                    Find Competitors
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">Top Competitors for "web development services"</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {competitorInsights.map((competitor, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{competitor.competitor}</CardTitle>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                              Rank #{competitor.ranking}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium block">Top Keywords:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {competitor.topKeywords.map((keyword, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium block">Backlinks</span>
                                <span>{competitor.backlinks.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="font-medium block">Domain Authority</span>
                                <span>{competitor.domainAuthority}/100</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              View Detailed Analysis
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Chatbot */}
      <SectionChatbot 
        isOpen={chatbotOpen} 
        onClose={() => setChatbotOpen(false)}
        sectionTitle="SEO"
        apiKey="sk-7c6a8a160ab646be9e19793ba72812f4"
        apiType="deepseek"
      />
    </div>
  );
};

export default SEOSection;
