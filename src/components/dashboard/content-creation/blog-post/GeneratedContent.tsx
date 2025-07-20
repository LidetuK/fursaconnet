
import { Button } from "@/components/ui/button";

interface GeneratedContentProps {
  content: string;
  blogTitle: string;
  onSaveAsDraft: () => void;
  onCopyToClipboard: () => void;
}

const GeneratedContent = ({
  content,
  blogTitle,
  onSaveAsDraft,
  onCopyToClipboard,
}: GeneratedContentProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-md">
        <p className="text-gray-700 whitespace-pre-line">{content}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveAsDraft}
        >
          Save as Draft
        </Button>
        <Button
          size="sm"
          className="bg-skilllink-green hover:bg-skilllink-dark-green"
          onClick={onCopyToClipboard}
        >
          Copy to Clipboard
        </Button>
      </div>
    </div>
  );
};

export default GeneratedContent;
