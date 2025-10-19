
interface Topic {
  id: string;
  title: string;
  description: string;
}

interface TopicSelectorProps {
  topics: Topic[];
  onSelectTopic?: (topicId: string) => void;
}

const TopicSelector = ({ topics, onSelectTopic }: TopicSelectorProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-4">2. Choose a Topic</h3>
      <div className="space-y-3">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            className="p-3 border border-gray-200 rounded-lg hover:border-skilllink-green cursor-pointer"
            onClick={() => onSelectTopic?.(topic.id)}
          >
            <h4 className="font-medium">{topic.title}</h4>
            <p className="text-sm text-gray-500">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;
