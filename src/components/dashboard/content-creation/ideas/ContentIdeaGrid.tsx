
import ContentIdeaCard from "./ContentIdeaCard";

interface ContentIdea {
  title: string;
  type: string;
  audience: string;
  difficulty: string;
  potential: string;
}

interface ContentIdeaGridProps {
  ideas: ContentIdea[];
}

const ContentIdeaGrid = ({ ideas }: ContentIdeaGridProps) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-lg mb-4">Generated Content Ideas</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {ideas.map((idea, index) => (
          <ContentIdeaCard key={index} idea={idea} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ContentIdeaGrid;
