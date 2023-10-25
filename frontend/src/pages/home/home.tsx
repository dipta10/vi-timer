import { todoColumns } from './todo-columns.tsx';
import { TodoList } from './todo-list.tsx';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
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
import { CurrentTodo } from '@/components/CurrentTodo.tsx';
import { Link, useNavigate } from 'react-router-dom';

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
    axios
      .get('http://localhost:8000/todo')
      .then(({ data }) => {
        console.log(data);
        setTodos(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentTab]);

  useEffect(() => {
    fetchRunningTodo(setRunningTodo);
  }, []);

  const addTodo = (value: Partial<TodoEntity>) => {
    axios
      .post('http://localhost:8000/todo', value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='container mx-auto py-10'>
      <div className='flex flex-row gap-2 items-center justify-between mb-2'>
        <div className='flex flex-row gap-2'>
          <Button onClick={onAddTaskBtnClick}>Add Task</Button>
          <Button
            className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
            onClick={() => navigate('/timeline')}
          >
            Timeline
          </Button>
        </div>
        <CurrentTodo></CurrentTodo>
      </div>
      <TodoList columns={todoColumns} data={todos} />
      <EditTaskDialog open={open} setOpen={setOpen} onSubmitForm={addTodo} />
    </div>
  );
}
