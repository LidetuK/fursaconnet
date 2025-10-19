
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTasks, CreateTaskData } from '@/hooks/useTasks';
import { Expert } from '@/hooks/useExperts';
import { Loader2, Plus } from 'lucide-react';

interface TaskAssignmentModalProps {
  expert: Expert;
  children: React.ReactNode;
}

const TaskAssignmentModal = ({ expert, children }: TaskAssignmentModalProps) => {
  const { createTask, creating } = useTasks();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateTaskData, 'assignedTo'>>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createTask({
      ...formData,
      assignedTo: expert.id
    });

    if (success) {
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        estimatedHours: undefined
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Task to {expert.full_name}</DialogTitle>
          <DialogDescription>
            Create a new task for {expert.full_name} ({expert.specialization})
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the task requirements..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="Hours"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={creating || !formData.title}
              className="bg-skilllink-green hover:bg-skilllink-dark-green"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;
