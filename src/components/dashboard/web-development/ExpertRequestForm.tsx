
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ExpertRequestFormProps {
  templateIds: string[];
  onSuccess?: () => void;
}

const ExpertRequestForm = ({ templateIds, onSuccess }: ExpertRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call to send request to experts
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Request sent successfully",
        description: "Our experts will contact you shortly about your selected templates.",
      });
      
      setOpen(false);
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-skilllink-green hover:bg-skilllink-dark-green">
          Send to Digital Experts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Expert Assistance</DialogTitle>
          <DialogDescription>
            Share details about your project with our digital experts. They'll help you customize and implement your selected template(s).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="templates">Selected Templates</Label>
            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-700">
              {templateIds.length} template(s) selected
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Additional Details</Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your project, customization needs, timeline, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-skilllink-green hover:bg-skilllink-dark-green"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertRequestForm;
