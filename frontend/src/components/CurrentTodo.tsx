import { useTodoStore } from '@/pages/states/store.ts';
import { CurrentTodoTimer } from '@/components/CurrentTodoTimer.tsx';
import { useEffect, useState } from 'react';

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
      <div className='border rounded py-2 px-3 flex flex-row items-center gap-3'>
        <div className='flex flex-row items-end gap-3 text-sm'>
          <div className='animate-pulse w-4 h-4 bg-red-500 rounded-full duration-1000 self-center'></div>
          <span className='font-bold'>{todoTitle}</span>
          {/* <FontAwesomeIcon */}
          {/*   style={{ */}
          {/*     fontSize: 'large', */}
          {/*     color: 'brown', */}
          {/*   }} */}
          {/*   icon={faClock} */}
          {/*   className='fa-beat' */}
          {/* /> */}
          <CurrentTodoTimer />
        </div>
      </div>
    )
  );
}
