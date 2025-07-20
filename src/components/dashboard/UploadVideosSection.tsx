import { useState } from 'react';
import { Upload, Video, FileVideo, Play, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UploadVideosSection = () => {
  const [uploadedVideos, setUploadedVideos] = useState([
    { id: 1, name: "Marketing Video 1.mp4", size: "15.2 MB", duration: "2:34", status: "uploaded" },
    { id: 2, name: "Product Demo.mov", size: "25.7 MB", duration: "4:12", status: "processing" },
    { id: 3, name: "Tutorial Video.mp4", size: "8.9 MB", duration: "1:45", status: "uploaded" }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f59e3e] rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Videos</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-700">Cancel</Button>
          <Button variant="outline" className="text-gray-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
          <Button className="bg-[#f59e3e] hover:bg-[#e8913a] text-white">
            <Clock className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="futuristic-card">
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Drop your videos here</h3>
                <p className="text-muted-foreground mb-4">
                  Supports MP4, MOV, AVI files up to 100MB
                </p>
                <Button className="btn-primary">
                  <Video className="w-4 h-4 mr-2" />
                  Choose Videos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Videos List */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="w-5 h-5 text-primary" />
            Uploaded Videos ({uploadedVideos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploadedVideos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{video.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{video.size}</span>
                      <span>•</span>
                      <span>{video.duration}</span>
                      <Badge variant={video.status === 'uploaded' ? 'default' : 'secondary'}>
                        {video.status}
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
                    <Play className="w-4 h-4 mr-1" />
                    Play
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

      {/* Video Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold text-primary">{uploadedVideos.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold text-primary">49.8 MB</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="text-2xl font-bold text-primary">8:31</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadVideosSection;