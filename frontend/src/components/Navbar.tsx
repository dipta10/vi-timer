import { Button } from '@/components/ui/button.tsx';
import { CurrentTodo } from '@/components/CurrentTodo.tsx';
import { Tab, useSessionStore, useTabStore } from '@/pages/states/store.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle.tsx';

export function Navbar() {
  const { pushTab, currentTab } = useTabStore();
  const { isLoggedIn, clearSession } = useSessionStore();
  const navigate = useNavigate();
  const onAddTaskBtnClick = () => {
    pushTab(Tab.ADD_TASK);
  };
  const activeNavBtn = 'border-b-4 border-b-red-500';
  const [timelineBtnClass, setTimelineBtnClass] = useState('');
  const [todoListBtnClass, setTodoListBtnClass] = useState('');
  useEffect(() => {
    switch (currentTab) {
      case Tab.TIMELINE:
        setTimelineBtnClass(activeNavBtn);
        setTodoListBtnClass('');
        break;
      case Tab.TASK_LIST:
        setTimelineBtnClass('');
        setTodoListBtnClass(activeNavBtn);
    }
  }, [currentTab]);

  // const onClickSecret = () => {
  //   const token = localStorage.getItem('accessToken');
  //   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   axios
  //     .get(`/auth/secret`)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const logout = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`;
    localStorage.clear();
    clearSession();
  };

  return (
    <div className='flex flex-row gap-2 items-center justify-between mb-2'>
      <div className='flex flex-row gap-2'>
        <Button
          className={`border rounded-md px-4 py-2 bg-white text-slate-900 text-sm ${todoListBtnClass}`}
          onClick={() => navigate('/')}
        >
          Todo List
        </Button>
        <Button
          className={`border rounded-md px-4 py-2 bg-white text-slate-900 text-sm ${timelineBtnClass}`}
          onClick={() => navigate('/timeline')}
        >
          Timeline
        </Button>
        {currentTab !== Tab.TIMELINE && (
          <Button
            className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
            onClick={onAddTaskBtnClick}
          >
            Add Task
          </Button>
        )}
        {isLoggedIn && (
          <Button
            className={`border rounded-md px-4 py-2 bg-white text-slate-900 text-sm`}
            onClick={logout}
          >
            Log Out
          </Button>
        )}
      </div>
      <div className='flex flex-row gap-2 items-center'>
        <ModeToggle />
        <CurrentTodo></CurrentTodo>
        {!isLoggedIn && (
          <Button
            className={`border rounded-md px-4 py-2 bg-white text-slate-900 text-sm`}
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_BACKEND_URL
              }/auth/google`)
            }
          >
            Log in using Google
          </Button>
        )}
      </div>
    </div>
  );
}
