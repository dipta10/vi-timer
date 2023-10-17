import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input.tsx';

interface EditTaskProps {
  title: string;
  description?: string;
  open: boolean;
  setOpen: any;
}

export function EditTaskDialog(task: EditTaskProps) {
  return (
    <Dialog open={task.open} onOpenChange={task.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <Input value={task.title} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
