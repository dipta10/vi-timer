import { useTodoStore } from '@/pages/states/store.ts';
import { CurrentTodoTimer } from '@/components/CurrentTodoTimer.tsx';
import { useEffect, useState } from 'react';
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CurrentTodo() {
  const { runningTodo } = useTodoStore();
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    const maxLength = 20;
    let title = runningTodo?.title.substr(0, maxLength);
    if (runningTodo && runningTodo.title.length > maxLength) {
      title += '...';
    }
    setTodoTitle(title ? title : '');
  }, [runningTodo]);

  return (
    runningTodo && (
      <div className='border rounded p-3 flex flex-row items-center gap-3'>
        <FontAwesomeIcon
          style={{
            fontSize: 'x-large',
            color: 'brown',
          }}
          className='fa-beat'
          icon={faHourglassStart}
        />
        <div>
          {todoTitle}
          <CurrentTodoTimer />
        </div>
      </div>
    )
  );
}
