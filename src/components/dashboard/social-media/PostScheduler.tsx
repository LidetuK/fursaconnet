
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from 'lucide-react';

const PostScheduler = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: "Check out our latest blog post on digital marketing trends!",
      platform: "Twitter",
      scheduledFor: "2024-01-15 14:30",
      status: "scheduled"
    },
    {
      id: 2,
      content: "New project showcase - Modern e-commerce platform",
      platform: "LinkedIn",
      scheduledFor: "2024-01-16 10:00",
      status: "scheduled"
    }
  ]);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      const newPost = {
        id: scheduledPosts.length + 1,
        content: "New scheduled post",
        platform: "Facebook",
        scheduledFor: `${selectedDate} ${selectedTime}`,
        status: "scheduled"
      };
      setScheduledPosts([...scheduledPosts, newPost]);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Post Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={handleSchedule} className="w-full">
          Schedule Post
        </Button>
        
        <div className="space-y-2">
          <h4 className="font-medium">Scheduled Posts</h4>
          {scheduledPosts.map((post) => (
            <div key={post.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{post.platform}</p>
                  <p className="text-xs text-gray-600 truncate">{post.content}</p>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.scheduledFor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostScheduler;
