import { useEffect, useState } from 'react';
import { useTodoStore } from '@/pages/states/store.ts';
import { secondsToHms } from '@/utils/time.utils.ts';

export function CurrentTodo() {
  const [timerTime, setTimerTime] = useState('');
  const { runningTodo } = useTodoStore();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('int 1');
      if (!runningTodo) return;
      const startTime = runningTodo.startTime?.getTime();
      if (!startTime) return;
      const currentTime = new Date().getTime();
      const diff = Math.ceil((currentTime - startTime) / 1000);
      const time = secondsToHms(diff);
      setTimerTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTodo]);

  return (
    <div className='text-red-50 text-red-300'>
      {/*{runningTodo?.title.substr(0, 10)}*/}
      {/*{' - '}*/}
      {/*{runningTodo?.startTime?.toLocaleTimeString()}*/}
      {timerTime}
    </div>
  );
}
