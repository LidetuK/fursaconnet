
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ContentIdea {
  title: string;
  type: string;
  audience: string;
  difficulty: string;
  potential: string;
}

interface ContentIdeaCardProps {
  idea: ContentIdea;
  index: number;
}

const ContentIdeaCard = ({ idea, index }: ContentIdeaCardProps) => {
  return (
    <Card key={index}>
      <CardContent className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">{idea.title}</h4>
        <div className="space-y-2">
          <p className="text-xs text-gray-500 flex justify-between">
            <span className="font-medium">Type:</span>
            <span>{idea.type}</span>
          </p>
          <p className="text-xs text-gray-500 flex justify-between">
            <span className="font-medium">Audience:</span>
            <span>{idea.audience}</span>
          </p>
          <p className="text-xs text-gray-500 flex justify-between">
            <span className="font-medium">Difficulty:</span>
            <span
              className={`${
                idea.difficulty === "Low"
                  ? "text-green-600"
                  : idea.difficulty === "Medium"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {idea.difficulty}
            </span>
          </p>
          <p className="text-xs text-gray-500 flex justify-between">
            <span className="font-medium">Potential Impact:</span>
            <span
              className={`${
                idea.potential === "Low"
                  ? "text-gray-600"
                  : idea.potential === "Medium"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              {idea.potential}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
        >
          Use This Idea
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContentIdeaCard;
