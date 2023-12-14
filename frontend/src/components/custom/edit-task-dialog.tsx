import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tab, TodoEntity, useTabStore } from '@/pages/states/store.ts';
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

interface EditTaskProps {
  todo?: TodoEntity;
  open: boolean;
  setOpen: any;
  onSubmitForm: (todo: Partial<TodoEntity>) => void;
  tabName: Tab;
}

const formSchema = z.object({
  title: z.string().min(2).max(1000),
  description: z.string().min(0).optional(),
});

export function EditTaskDialog(prop: EditTaskProps) {
  const { popTab, currentTab } = useTabStore();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [activeInput, setActiveInput] = useState(0);
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
    form.setValue('title', prop.todo?.title ?? '');
    form.setValue('description', prop.todo?.description ?? '');
    if (prop.open && inputRefs.current.length > 0) {
      setActiveInput(0);
      inputRefs.current[0]?.focus();
    }
  }, [prop.open]);

  useHotkeys(
    `${Key.ArrowDown}, j`,
    () => {
      setActiveInput((p) => (p + 1) % numberOfActiveInput);
    },
    {
      enabled: currentTab === prop.tabName && !insertMode && prop.open,
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
      enabled: currentTab === prop.tabName && !insertMode && prop.open,
    },
  );

  useHotkeys(
    `${Key.Control}+${Key.Enter}`,
    () => {
      setInsertMode(false);
      inputRefs.current[activeInput].setAttribute('disabled', 'disabled');
    },
    {
      enabled: currentTab === prop.tabName && insertMode && prop.open,
      enableOnContentEditable: true,
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  useHotkeys(
    Key.Escape,
    () => {
      if (insertMode) {
        setInsertMode(false);
        inputRefs.current[activeInput].setAttribute('disabled', 'disabled');
      } else {
        onOpenChange();
      }
    },
    {
      enabled: currentTab === prop.tabName && prop.open,
      enableOnContentEditable: true,
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

  useHotkeys(
    `${Key.Enter}`,
    () => {
      if (activeInput == 2) {
        form.handleSubmit(onSubmit)();
        return;
      }
      setInsertMode(true);
      inputRefs.current[activeInput].removeAttribute('disabled');
      inputRefs.current[activeInput].focus();
    },
    {
      enabled: currentTab === prop.tabName && !insertMode,
      preventDefault: true,
    },
  );

  function onSubmit(value: z.infer<typeof formSchema>) {
    prop.onSubmitForm({
      id: prop.todo?.id,
      title: value.title,
      description: value.description,
      status: true,
      timeSpent: 0,
    });
    onOpenChange();
    form.clearErrors();
  }

  const onOpenChange = () => {
    prop.setOpen((p: any) => !p);
    popTab();
  };

  return (
    <Dialog open={prop.open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
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
                let className = ' transition-all duration-200 ease-out ';
                if (activeInput === 1) className += ' active-input';
                if (activeInput === 1 && insertMode) {
                  className += ' min-h-[500px]';
                }
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={true}
                        ref={(el) => (inputRefs.current[1] = el as any)}
                        className={className}
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
              Save Todo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
