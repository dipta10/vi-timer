import { ColumnDef } from '@tanstack/react-table';
import { secondsToHms } from '@/utils/time.utils.ts';
import { TimelineRow } from '@/components/types/timeline.ts';

export const trackColumnsByDay: ColumnDef<TimelineRow>[] = [
  {
    accessorKey: 'title',
    header: () => <div className='text-left font-bold'>Title</div>,
    cell: ({ row }) => {
      const title = row.original.title;
      const type = row.original.type;
      let style = '';
      if (type === 'day') {
        style = 'text-right';
      }
      return <div className={`text-left ${style}`}>{title}</div>;
    },
  },
  {
    accessorKey: 'spent',
    header: () => (
      <div className='text-right font-bold' style={{ minWidth: '100px' }}>
        Time Spent
      </div>
    ),
    cell: ({ row }) => {
      const spent = secondsToHms(row.original.totalTimeSpent);
      const type = row.original.type;
      if (type === 'day') {
        return <div className={`text-left`}>{spent}</div>;
      }
      return <div className={`text-right`}>{spent}</div>;
    },
  },
];
