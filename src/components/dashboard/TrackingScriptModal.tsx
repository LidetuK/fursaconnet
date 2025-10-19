import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, AlertCircle, Code, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackingScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrackingScriptModal = ({ isOpen, onClose }: TrackingScriptModalProps) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [trackingName, setTrackingName] = useState('');
  const [trackingScript, setTrackingScript] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateTrackingScript = async () => {
    if (!websiteUrl || !trackingName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both website URL and tracking name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://fursaconnet-production.up.railway.app/analytics/generate-tracking-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          websiteUrl,
          trackingName
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTrackingScript(data.trackingScript);
        setTrackingId(data.trackingId);
        toast({
          title: "Success!",
          description: "Tracking script generated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate tracking script.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tracking script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackingScript);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Tracking script copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Generate Tracking Script
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration Form */}
          {!trackingScript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="trackingName">Tracking Name</Label>
                  <Input
                    id="trackingName"
                    placeholder="My Website Analytics"
                    value={trackingName}
                    onChange={(e) => setTrackingName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={generateTrackingScript} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Tracking Script'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generated Script */}
          {trackingScript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Your Tracking Script
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Script'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTrackingScript('');
                        setTrackingId('');
                        setWebsiteUrl('');
                        setTrackingName('');
                      }}
                    >
                      Generate New
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Tracking ID:</strong> {trackingId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Website:</strong> {websiteUrl}
                    </p>
                  </div>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{trackingScript}</pre>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Installation Instructions</h4>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Copy the tracking script above</li>
                          <li>Paste it into the &lt;head&gt; section of your website</li>
                          <li>Make sure it appears before the closing &lt;/head&gt; tag</li>
                          <li>Save and publish your website</li>
                          <li>Visit your website to start collecting data</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingScriptModal; 
