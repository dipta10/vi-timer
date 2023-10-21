import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tab, useTabStore } from '@/pages/states/store.ts';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import axios from 'axios';

interface EditTaskProps {
  title: string;
  description?: string;
  open: boolean;
  setOpen: any;
}

const formSchema = z.object({
  title: z.string().min(2).max(1000),
  description: z.string(),
});

export function EditTaskDialog(task: EditTaskProps) {
  const { popTab } = useTabStore();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [activeInput, setActiveInput] = useState(0);
  const { currentTab } = useTabStore();
  const [insertMode, setInsertMode] = useState(false);
  const numberOfActiveInput = 3;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    setInsertMode(false);
    form.setValue('title', task.title);
    form.setValue('description', task.description as any);
    if (task.open && inputRefs.current.length > 0) {
      setActiveInput(0);
      // don't this this is needed?
      inputRefs.current[0]?.focus();
    }
  }, [task.open]);

  useHotkeys(
    `${Key.ArrowDown}, j`,
    () => {
      setActiveInput((p) => (p + 1) % numberOfActiveInput);
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
    },
  );

  useHotkeys(
    `${Key.ArrowUp}, k`,
    () => {
      setActiveInput(
        (p) => (p - 1 + numberOfActiveInput) % numberOfActiveInput,
      );
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
    },
  );

  useHotkeys(
    `${Key.Control}+${Key.Enter}, ${Key.Escape}`,
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

  // // need to prevent the default behaviour of the dialog first
  // useHotkeys(Key.Escape, () => {
  //   console.log('escape pressed');
  // });

  useHotkeys(
    `${Key.Enter}`,
    () => {
      console.log('inputRefs', inputRefs);
      if (activeInput == 2) {
        form.handleSubmit(onSubmit)();
        return;
      }
      setInsertMode(true);
      inputRefs.current[activeInput].removeAttribute('disabled');
      inputRefs.current[activeInput].focus();
    },
    {
      enabled: currentTab === Tab.ADD_TASK && !insertMode,
      preventDefault: true,
    },
  );

  function onSubmit(value: z.infer<typeof formSchema>) {
    console.log(value);
    axios
      .post('http://localhost:8000/todo', value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    onOpenChange();
  }

  const onOpenChange = () => {
    task.setOpen((p: any) => !p);
    popTab();
  };

  return (
    <Dialog open={task.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={true}
                        placeholder='Title'
                        ref={(el) =>
                          (inputRefs.current[0] = el as HTMLInputElement)
                        }
                        className={activeInput === 0 ? 'active-input' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={true}
                        placeholder='description'
                        ref={(el) => (inputRefs.current[1] = el as any)}
                        className={activeInput === 1 ? 'active-input' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              ref={(el) => (inputRefs.current[2] = el as any)}
              className={activeInput === 2 ? 'active-button' : ''}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save Task
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
