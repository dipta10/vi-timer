import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTabStore } from '@/pages/states/store.ts';

interface EditTaskProps {
  title: string;
  setTitle?: any;
  description?: string;
  open: boolean;
  setOpen: any;
}

export function EditTaskDialog(task: EditTaskProps) {
  const { popTab } = useTabStore();

  const onOpenChange = () => {
    console.log('on open change called!');
    task.setOpen((p: any) => !p);
    popTab();
  };

  return (
    <Dialog open={task.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <Input
            disabled={true}
            value={task.title}
            onChange={(event) => {
              task.setTitle(event.target.value);
            }}
          />
          <Label htmlFor='description'>Your message</Label>
          <Textarea disabled={true} id='description' />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
