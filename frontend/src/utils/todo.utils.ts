import axios from 'axios';
import { TimeTracking, TodoEntity } from '@/pages/states/store.ts';

export const fetchRunningTodo = (
  setRunningTodo: (todo: TodoEntity) => void,
) => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/todo/get-running`)
    .then(({ data: todo }) => {
      if (!todo) return;
      const tracking = (todo as any).TimeTracking[0] as TimeTracking;
      if (!tracking) return;
      todo.startTime = new Date(tracking.startTime);
      setRunningTodo(todo);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchTodos = (setTodos: (todos: TodoEntity[]) => void) => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/todo`)
    .then(({ data }) => {
      setTodos(data);
    })
    .catch((err) => {
      console.error('error fetching todos', err);
    });
};
