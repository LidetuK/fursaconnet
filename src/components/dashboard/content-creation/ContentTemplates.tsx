
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeatureExplanation from './FeatureExplanation';

const ContentTemplates = () => {
  // Mock content templates
  const contentTemplates = [
    {
      title: "Case Study",
      description: "Showcase your success stories with a detailed case study",
      structure: [
        "Challenge",
        "Solution",
        "Implementation",
        "Results",
        "Testimonial",
      ],
      estimatedTime: "30-45 minutes",
    },
    {
      title: "How-To Guide",
      description: "Create educational content that establishes your expertise",
      structure: [
        "Introduction",
        "Step 1-5",
        "Tips",
        "Conclusion",
        "Call to Action",
      ],
      estimatedTime: "20-30 minutes",
    },
    {
      title: "Product Review",
      description: "Share honest opinions about products or services",
      structure: ["Overview", "Features", "Benefits", "Drawbacks", "Verdict"],
      estimatedTime: "25-35 minutes",
    },
    {
      title: "Industry News",
      description: "Cover recent developments in your industry",
      structure: ["Headline", "Summary", "Details", "Impact", "Analysis"],
      estimatedTime: "15-25 minutes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Templates</CardTitle>
        <CardDescription>
          Use pre-designed templates to create various types of content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Feature explanation for content templates */}
        <FeatureExplanation 
          title="Content Templates"
          description="These pre-designed templates help you create professional content quickly. Choose a template, fill in your information, and generate ready-to-use content for your marketing needs."
          amharicDescription="እነዚህ አስቀድመው የተነደፉ አብነቶች በፍጥነት ሙያዊ ይዘትን እንዲፈጥሩ ይረዳዎታል። አብነት ይምረጡ፣ መረጃዎን ይሙሉ፣ እና ለግብይት ፍላጎትዎ ዝግጁ የሆነ ይዘት ያመንጩ።"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentTemplates.map((template, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {template.title}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Structure:
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                    {template.structure.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">
                    Estimated Completion Time:
                  </span>{" "}
                  {template.estimatedTime}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-skilllink-green hover:bg-skilllink-dark-green">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          {/* Feature explanation for custom template builder */}
          <FeatureExplanation 
            title="Custom Template Builder"
            description="Create your own custom content template. Enter a name, description, and sections, then save your template for future use."
            amharicDescription="የራስዎን ብጁ የይዘት አብነት ይፍጠሩ። ስም፣ መግለጫ እና ክፍሎችን ያስገቡ፣ ከዚያም ለወደፊት አጠቃቀም አብነትዎን ያስቀምጡ።"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTemplates;
