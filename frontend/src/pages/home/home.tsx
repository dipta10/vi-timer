import { columns, Todo } from './columns';
import { DataTable } from './data-table';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Tab, useTabStore } from '@/pages/states/store.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import axios from 'axios';

function getData(): Todo[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      timeSpent: 100,
      status: true,
      title: 'react - get the basics',
    },
    {
      id: '728ed523',
      timeSpent: 100,
      status: false,
      title: 'python - unit testing',
    },
    {
      id: '728ed525',
      timeSpent: 100,
      status: false,
      title: 'python - pytest',
    },
    // ...
  ];
}

export default function Home() {
  const data = getData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { currentTab, pushTab } = useTabStore();
  useHotkeys(`${Key.Shift}+a`, () => onAddTaskBtnClick(), {
    enabled: currentTab === Tab.TASK_LIST,
  });

  const onAddTaskBtnClick = () => {
    setTitle('');
    setOpen(true);
    pushTab(Tab.ADD_TASK);
  };

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/todo')
      .then(({ data }) => {
        data.forEach((d: any) => (d.timeSpent = 200));

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
