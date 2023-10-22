import { columns } from './columns';
import { DataTable } from './data-table';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Tab, useTabStore, useTodoStore } from '@/pages/states/store.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import axios from 'axios';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { setTodos, todos } = useTodoStore();
  const { currentTab, pushTab } = useTabStore();
  useHotkeys(`${Key.Shift}+a`, () => onAddTaskBtnClick(), {
    enabled: currentTab === Tab.TASK_LIST,
  });

  const onAddTaskBtnClick = () => {
    setTitle('');
    setOpen(true);
    pushTab(Tab.ADD_TASK);
  };


  useEffect(() => {
    axios
      .get('http://localhost:8000/todo')
      .then(({ data }) => {
        setTodos(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentTab]);

  return (
    <div className='container mx-auto py-10'>
      <Button onClick={onAddTaskBtnClick}>Add Task</Button>
      <DataTable columns={columns} data={todos} />
      <EditTaskDialog title={title} open={open} setOpen={setOpen} />
    </div>
  );
}
