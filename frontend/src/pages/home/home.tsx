import { todoColumns } from './todo-columns.tsx';
import { TodoList } from './todo-list.tsx';
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
import { fetchRunningTodo } from '@/utils/todo.utils.ts';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar.tsx';
import { ViTable } from '@/components/custom/vi-table.tsx';
import { TodoListAlt } from '@/pages/todo-list/TodoListAlt.tsx';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { setTodos, setRunningTodo, todos } = useTodoStore();
  const { currentTab, pushTab } = useTabStore();
  const navigate = useNavigate();
  useHotkeys(`${Key.Shift}+a`, () => onAddTaskBtnClick(), {
    enabled: currentTab === Tab.TASK_LIST,
  });
  useHotkeys(`c`, () => navigate('/timeline'), {
    enabled: currentTab === Tab.TASK_LIST,
  });

  const onAddTaskBtnClick = () => {
    setOpen(true);
    pushTab(Tab.ADD_TASK);
  };

  useEffect(() => {
    console.log('fetching running todo');
    fetchRunningTodo(setRunningTodo);
  }, []);

  const addTodo = (value: Partial<TodoEntity>) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/todo`, value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='container mx-auto py-10'>
      <Navbar />
      <TodoListAlt />
      {/*Todo List*/}
      <br />
      <br />
      <br />
      {/*<TodoList columns={todoColumns} data={todos} />*/}
      <EditTaskDialog open={open} setOpen={setOpen} onSubmitForm={addTodo} />
    </div>
  );
}
