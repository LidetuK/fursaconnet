
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeatureExplanation from './FeatureExplanation';

const ContentCalendar = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
        <CardDescription>
          Plan and schedule your content across different channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeatureExplanation 
          title="Content Calendar"
          description="Plan your content strategy with a visual calendar. Schedule content for different platforms, track deadlines, and ensure consistent publishing."
          amharicDescription="በእይታዊ ቀን መቁጠሪያ የይዘት ስትራቴጂዎን ያቅዱ። ለተለያዩ መድረኮች ይዘትን ያቅዱ፣ የመጨረሻ ቀኖችን ይከታተሉ እና ወጥነት ያለው ክወና ያረጋግጡ።"
        />
        
        <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <h3 className="font-medium text-lg mb-2">Content Calendar Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            Our visual content calendar feature is currently in development.
            Check back soon for updates!
          </p>
          <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
            Get Notified When Available
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCalendar;
