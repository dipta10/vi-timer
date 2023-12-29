import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import React, { useEffect, useState } from 'react';
import {
  Tab,
  TodoEntity,
  useTabStore,
  useTodoStore,
} from '@/pages/states/store.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import axios from 'axios';
import { fetchRunningTodo, fetchTodos } from '@/utils/todo.utils.ts';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar.tsx';
import { TodoList } from '@/pages/todo-list/TodoList.tsx';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { setRunningTodo, setTodos } = useTodoStore();
  const { currentTab, pushTab, setTab } = useTabStore();
  const navigate = useNavigate();
  useHotkeys(`${Key.Shift}+a`, () => onAddTaskBtnClick(), {
    enabled: currentTab === Tab.TASK_LIST,
  });
  useHotkeys(`c`, () => navigate('/timeline'), {
    enabled: currentTab === Tab.TASK_LIST,
  });

  const onAddTaskBtnClick = () => {
    pushTab(Tab.ADD_TASK);
  };

  useEffect(() => {
    setTab(Tab.TASK_LIST);
    fetchRunningTodo(setRunningTodo);
  }, []);

  useEffect(() => {
    if (currentTab === Tab.ADD_TASK) setOpen(true);
  }, [currentTab]);

  const addTodo = (value: Partial<TodoEntity>) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/todo`, value)
      .then((res) => {
        console.log(res);
        fetchTodos(setTodos);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='container mx-auto py-10'>
      <Navbar />
      <TodoList />
      <EditTaskDialog
        open={open}
        setOpen={setOpen}
        onSubmitForm={addTodo}
        tabName={Tab.ADD_TASK}
      />
    </div>
  );
}
