import { useState } from 'react';
import { Upload, FileText, Image, File, Trash2, Eye, Download, Hash, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const UploadContentSection = () => {
  const [uploadedContent, setUploadedContent] = useState([
    { id: 1, name: "Blog Post Draft.docx", type: "document", size: "2.1 MB", status: "uploaded" },
    { id: 2, name: "Product Image.jpg", type: "image", size: "5.3 MB", status: "uploaded" },
    { id: 3, name: "Marketing Copy.pdf", type: "document", size: "1.8 MB", status: "processing" },
    { id: 4, name: "Banner Design.png", type: "image", size: "3.2 MB", status: "uploaded" }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6 text-primary" />;
      case 'document':
        return <FileText className="w-6 h-6 text-primary" />;
      default:
        return <File className="w-6 h-6 text-primary" />;
    }
  };

  const documents = uploadedContent.filter(item => item.type === 'document');
  const images = uploadedContent.filter(item => item.type === 'image');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f59e3e] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-700">Cancel</Button>
          <Button variant="outline" className="text-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Publish
          </Button>
          <Button className="bg-[#f59e3e] hover:bg-[#e8913a] text-white">
            <Upload className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Content Type and Style Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-[#f59e3e] text-xl">📝</span>
              <CardTitle className="text-lg font-semibold text-gray-900">Content Type</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="p-3 text-center border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <p className="font-medium text-gray-900">Text Post</p>
            </div>
            <div className="p-3 text-center border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <p className="font-medium text-gray-900">Image Post</p>
            </div>
            <div className="p-3 text-center border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <p className="font-medium text-gray-900">Carousel</p>
            </div>
          </CardContent>
        </Card>

        {/* Select Platforms */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Select Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">X</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ketema Lidetu</p>
                    <p className="text-sm text-gray-600">X Platform • Connected</p>
                    <p className="text-xs text-[#f59e3e]">@KetemaNBRIU</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600">×</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Style */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-[#f59e3e] text-xl">🎨</span>
            <CardTitle className="text-lg font-semibold text-gray-900">Content Style</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-[#f59e3e] bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-700">💼</span>
              <span className="font-medium text-gray-900">Professional</span>
            </div>
            <p className="text-sm text-gray-600">Business & Career</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">🌟</span>
              <span className="font-medium text-gray-900">Social</span>
            </div>
            <p className="text-sm text-gray-600">Personal & Lifestyle</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-500">💎</span>
              <span className="font-medium text-gray-900">Promotional</span>
            </div>
            <p className="text-sm text-gray-600">Marketing & Sales</p>
          </div>
        </CardContent>
      </Card>

      {/* Write Content */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#f59e3e] text-xl">✍️</span>
              <CardTitle className="text-lg font-semibold text-gray-900">Write Your Content</CardTitle>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
              AI Assist
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title/Headline (Optional)
            </Label>
            <Input
              id="title"
              placeholder="Enter a compelling title..."
              className="mt-1"
            />
            <Button variant="ghost" size="sm" className="text-gray-500 mt-1">
              <Wand2 className="w-3 h-3 mr-1" />
            </Button>
          </div>
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Main Content
            </Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, insights, or story..."
              className="mt-1 min-h-[120px]"
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="text-gray-600">
                <Wand2 className="w-3 h-3 mr-1" />
                Generate Content
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600">
                <Hash className="w-3 h-3 mr-1" />
                Add Hashtags
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Select platforms to see how your content will look</p>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="all">All Files ({uploadedContent.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="w-5 h-5 text-primary" />
                All Content Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedContent.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <Badge variant={file.status === 'uploaded' ? 'default' : 'secondary'}>
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Document Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <Badge variant={file.status === 'uploaded' ? 'default' : 'secondary'}>
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Image Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Image className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{file.size}</span>
                          <Badge variant={file.status === 'uploaded' ? 'default' : 'secondary'}>
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold text-primary">{uploadedContent.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <File className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold text-primary">{documents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold text-primary">{images.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold text-primary">12.4 MB</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadContentSection;