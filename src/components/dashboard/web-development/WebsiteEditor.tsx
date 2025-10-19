
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit3, Loader2, Plus, Sparkles } from 'lucide-react';

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

interface WebsiteEditorProps {
  website: GeneratedWebsite | null;
  onEdit: (editPrompt: string) => Promise<void>;
  isLoading: boolean;
}

const WebsiteEditor = ({ website, onEdit, isLoading }: WebsiteEditorProps) => {
  const [editPrompt, setEditPrompt] = useState("");
  const [editHistory, setEditHistory] = useState<string[]>([]);

  if (!website) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No website to edit. Generate a website first.</p>
        </CardContent>
      </Card>
    );
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) return;

    await onEdit(editPrompt);
    setEditHistory(prev => [...prev, editPrompt]);
    setEditPrompt("");
  };

  const suggestedEdits = [
    "Add a testimonials section with customer reviews",
    "Include a pricing table with different plans",
    "Add a blog section with recent articles",
    "Include social media icons in the footer",
    "Add a newsletter signup form",
    "Include a FAQ section",
    "Add a team/about us section with photos",
    "Include a services grid with icons",
    "Add a call-to-action banner",
    "Include breadcrumb navigation"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-skilllink-green" />
            Edit Website
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Describe the changes you want to make
              </label>
              <Textarea
                placeholder="Example: Add a testimonials section with 3 customer reviews, or change the color scheme to green and white"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="min-h-24"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
              disabled={isLoading || !editPrompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Website...
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Apply Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Suggested Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedEdits.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-3"
                onClick={() => setEditPrompt(suggestion)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {editHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editHistory.map((edit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary">Edit {index + 1}</Badge>
                  <span className="text-sm text-gray-600">{edit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebsiteEditor;
