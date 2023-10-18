import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tab, useTabStore } from '@/pages/states/store.ts';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

interface EditTaskProps {
  title: string;
  setTitle?: any;
  description?: string;
  open: boolean;
  setOpen: any;
}

export function EditTaskDialog(task: EditTaskProps) {
  const { popTab } = useTabStore();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [activeInput, setActiveInput] = useState(0);
  const { currentTab } = useTabStore();
  const [insertMode, setInsertMode] = useState(false);

  useEffect(() => {
    setInsertMode(false);
    if (task.open && inputRefs.current.length > 0) {
      setActiveInput(0);
      // don't this this is needed?
      inputRefs.current[0]?.focus();
    }
  }, [task.open]);

  useHotkeys(
    `${Key.ArrowDown}, j`,
    () => {
      setActiveInput((p) => (p + 1) % 2);
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
    },
  );

  useHotkeys(
    `${Key.ArrowUp}, k`,
    () => {
      setActiveInput((p) => (p - 1 + 2) % 2);
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
    },
  );

  useHotkeys(
    `${Key.Control}+${Key.Enter}`,
    () => {
      setInsertMode(false);
      inputRefs.current[activeInput].setAttribute('disabled', 'disabled');
    },
    {
      enabled: currentTab === Tab.ADD_TASK && insertMode,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    `${Key.Enter}`,
    () => {
      setInsertMode(true);
      inputRefs.current[activeInput].removeAttribute('disabled');
      inputRefs.current[activeInput].focus();
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
      preventDefault: true,
    },
  );

  const onOpenChange = () => {
    task.setOpen((p: any) => !p);
    popTab();
  };

  return (
    <Dialog open={task.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          active input: {activeInput}
          <br />
          insert mode: {insertMode ? 'true' : 'false'}
          <br/>
          currentTab: {currentTab}
          <div>
            <Label htmlFor='title'>Task Title</Label>
            <Input
              id='title'
              ref={(el) => (inputRefs.current[0] = el as HTMLInputElement)}
              disabled={true}
              value={task.title}
              onChange={(event) => {
                task.setTitle(event.target.value);
              }}
              className={activeInput === 0 ? 'active-input' : ''}
              onClick={() => {
                console.log('clicked!!');
              }}
            />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              ref={(el) => (inputRefs.current[1] = el as any)}
              className={activeInput === 1 ? 'active-input' : ''}
              disabled={true}
              id='description'
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
