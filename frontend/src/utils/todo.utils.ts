import axios from 'axios';
import { TimeTracking, TodoEntity } from '@/pages/states/store.ts';

export const fetchRunningTodo = (storeTodo: (todo: TodoEntity) => void) => {
  axios
    .get('http://localhost:8000/todo/get-running')
    .then(({ data: todo }) => {
      if (!todo) return;
      const tracking = (todo as any).TimeTracking[0] as TimeTracking;
      if (!tracking) return;
      todo.startTime = new Date(tracking.startTime);
      storeTodo(todo);
    })
    .catch((err) => {
      console.log(err);
    });
};
