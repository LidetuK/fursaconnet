
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Github, FileText, Archive, Globe, Copy } from 'lucide-react';

interface GeneratedWebsite {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WebsiteExporterProps {
  website: GeneratedWebsite | null;
}

const WebsiteExporter = ({ website }: WebsiteExporterProps) => {
  const [githubRepo, setGithubRepo] = useState("");
  const [exportType, setExportType] = useState<'zip' | 'github' | 'copy'>('zip');
  const { toast } = useToast();

  if (!website) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No website to export. Generate a website first.</p>
        </CardContent>
      </Card>
    );
  }

  const handleDownloadZip = () => {
    const files = [
      { name: 'index.html', content: website.html },
      { name: 'styles.css', content: website.css },
      { name: 'script.js', content: website.js },
      { name: 'README.md', content: generateReadme() }
    ];

    // Create a simple zip-like structure (for demonstration)
    const zipContent = files.map(file => 
      `=== ${file.name} ===\n${file.content}\n\n`
    ).join('');

    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.name.toLowerCase().replace(/\s+/g, '-')}-website.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your website files are being downloaded."
    });
  };

  const handleCopyCode = async () => {
    const fullCode = `${website.html}\n\n<style>\n${website.css}\n</style>\n\n<script>\n${website.js}\n</script>`;
    
    try {
      await navigator.clipboard.writeText(fullCode);
      toast({
        title: "Code Copied",
        description: "The complete website code has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy code to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleGithubExport = () => {
    // This would integrate with GitHub API in a real implementation
    toast({
      title: "GitHub Integration",
      description: "GitHub export feature will be available soon. For now, please download the files and push them manually."
    });
  };

  const generateReadme = () => {
    return `# ${website.name}

${website.description}

## Generated Website

This website was generated using AI based on the following prompt:
"${website.prompt}"

## Files Structure

- \`index.html\` - Main HTML file
- \`styles.css\` - CSS styling
- \`script.js\` - JavaScript functionality

## How to Use

1. Open \`index.html\` in a web browser
2. For local development, use a local server (e.g., Live Server extension in VS Code)
3. Customize the content, styling, and functionality as needed

## Generated on

${website.createdAt.toLocaleDateString()}

---

*This website was generated using SkillLink's AI Website Generator*
`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-skilllink-green" />
            Export Your Website
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Download as Files */}
            <Card className="p-4">
              <div className="text-center space-y-3">
                <Archive className="h-8 w-8 mx-auto text-blue-500" />
                <h3 className="font-semibold">Download Files</h3>
                <p className="text-sm text-gray-600">
                  Get all files (HTML, CSS, JS) as a package
                </p>
                <Button
                  onClick={handleDownloadZip}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>

            {/* Copy Code */}
            <Card className="p-4">
              <div className="text-center space-y-3">
                <Copy className="h-8 w-8 mx-auto text-green-500" />
                <h3 className="font-semibold">Copy Code</h3>
                <p className="text-sm text-gray-600">
                  Copy complete website code to clipboard
                </p>
                <Button
                  onClick={handleCopyCode}
                  className="w-full"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </Card>

            {/* GitHub Integration */}
            <Card className="p-4">
              <div className="text-center space-y-3">
                <Github className="h-8 w-8 mx-auto text-gray-700" />
                <h3 className="font-semibold">Push to GitHub</h3>
                <p className="text-sm text-gray-600">
                  Create a GitHub repository with your website
                </p>
                <Button
                  onClick={handleGithubExport}
                  className="w-full"
                  variant="outline"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Website Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div><strong>Name:</strong> {website.name}</div>
              <div><strong>Created:</strong> {website.createdAt.toLocaleString()}</div>
              <div><strong>Last Updated:</strong> {website.updatedAt.toLocaleString()}</div>
              <div><strong>Files:</strong> HTML, CSS, JavaScript, README</div>
              <div><strong>Size:</strong> ~{Math.round((website.html.length + website.css.length + website.js.length) / 1024)}KB</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Deployment Options
            </h4>
            <p className="text-blue-700 text-sm mb-3">
              Your website is ready to be deployed to any hosting platform:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded border">Netlify</div>
              <div className="bg-white p-2 rounded border">Vercel</div>
              <div className="bg-white p-2 rounded border">GitHub Pages</div>
              <div className="bg-white p-2 rounded border">Firebase</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteExporter;
