import { Todo, columns } from './columns';
import { DataTable } from './data-table';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';

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

  const onAddTaskBtnClick = () => {
    setTitle('');
    setOpen(true);
  };

  return (
    <div className='container mx-auto py-10'>
      <Button onClick={onAddTaskBtnClick}>Add Task</Button>
      <DataTable columns={columns} data={data} />
      <EditTaskDialog
        setTitle={setTitle}
        title={title}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
