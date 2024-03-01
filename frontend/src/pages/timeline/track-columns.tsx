import { ColumnDef } from '@tanstack/react-table';
import { TimeEntry } from '@/pages/states/store.ts';
import { secondsToHms } from '@/utils/time.utils.ts';
import { CurrentTodoTimer } from '@/components/CurrentTodoTimer.tsx';
import moment from 'moment';

export const trackColumns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: 'title',
    header: () => <div className='text-left font-bold'>Title</div>,
    cell: ({ row }) => {
      const title = row.original.todo.title;
      return (
        <div
          className={`text-left flex flex-row gap-2 content-center items-center`}
        >
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: 'startTime',
    header: () => (
      <div className='text-right font-bold' style={{ minWidth: '100px' }}>
        Spent
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const endTime = row.original.endTime;
      const secondDiff = Math.abs(
        moment(endTime).diff(moment(startTime), 'seconds'),
      );
      const spent = secondsToHms(secondDiff);
      return (
        <div className={`text-right font-medium `}>
          {endTime && spent}
          {!endTime && <CurrentTodoTimer />}
          <br />
          <div className='opacity-50 text-xs'>
            {startTime.toLocaleTimeString()}
            {' - '}
            {endTime && endTime.toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
];
