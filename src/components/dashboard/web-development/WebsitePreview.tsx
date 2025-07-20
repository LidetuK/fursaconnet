
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code2, Smartphone, Monitor, Tablet } from 'lucide-react';

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

interface WebsitePreviewProps {
  website: GeneratedWebsite | null;
}

const WebsitePreview = ({ website }: WebsitePreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');

  if (!website) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No website generated yet. Go to the Generate tab to create your first website.</p>
        </CardContent>
      </Card>
    );
  }

  const getPreviewSize = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  const combinedCode = `${website.html}

<style>
${website.css}
</style>

<script>
${website.js}
</script>`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-skilllink-green" />
              {website.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('preview')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant={activeView === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('code')}
              >
                <Code2 className="h-4 w-4 mr-1" />
                Code
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">{website.description}</p>
        </CardHeader>
        <CardContent>
          {activeView === 'preview' ? (
            <>
              <div className="flex justify-center gap-2 mb-4">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="h-4 w-4 mr-1" />
                  Tablet
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </Button>
              </div>

              <div className="flex justify-center">
                <div className={`${getPreviewSize()} transition-all duration-300`}>
                  <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
                    <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                        {website.name.toLowerCase().replace(/\s+/g, '-')}.com
                      </div>
                    </div>
                    <iframe
                      srcDoc={combinedCode}
                      className="w-full h-96 border-none"
                      title={`Preview of ${website.name}`}
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    <code>{website.html}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="css" className="mt-4">
                <div className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    <code>{website.css}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="js" className="mt-4">
                <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    <code>{website.js}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Created: {website.createdAt.toLocaleString()}</span>
            <span>Last updated: {website.updatedAt.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePreview;
