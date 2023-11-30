import { Button } from '@/components/ui/button.tsx';
import { CurrentTodo } from '@/components/CurrentTodo.tsx';
import { Tab, useTabStore } from '@/pages/states/store.ts';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle.tsx';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentTab, pushTab, tabHistory } = useTabStore();
  const navigate = useNavigate();
  const onAddTaskBtnClick = () => {
    setOpen(true);
    pushTab(Tab.ADD_TASK);
  };

  return (
    <div className='flex flex-row gap-2 items-center justify-between mb-2'>
      <div className='flex flex-row gap-2'>
        <Button onClick={onAddTaskBtnClick}>Add Task</Button>
        <Button
          className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
          onClick={() => navigate('/timeline')}
        >
          Timeline
        </Button>
        <Button
          className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
          onClick={() => navigate('/')}
        >
          Todo List
        </Button>
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <ModeToggle />
        <CurrentTodo></CurrentTodo>
      </div>
    </div>
  );
}