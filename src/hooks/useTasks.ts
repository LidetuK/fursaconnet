
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CreateTaskData {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  estimatedHours?: number;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const createTask = async (taskData: CreateTaskData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create tasks",
        variant: "destructive"
      });
      return false;
    }

    try {
      setCreating(true);
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          assigned_to: taskData.assignedTo,
          assigned_by: user.id,
          client_id: user.id,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          estimated_hours: taskData.estimatedHours,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Task created",
        description: "Task has been successfully assigned to the expert"
      });

      return true;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    createTask,
    creating
  };
};
