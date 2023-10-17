import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input.tsx';

interface EditTaskProps {
  title: string;
  description?: string;
}

export function EditTaskDialog(task: EditTaskProps) {
  return (
    <Dialog>
      <DialogTrigger>🚧</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <Input value={task.title} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
