import { ColumnDef } from '@tanstack/react-table';
import { TodoEntity } from '@/pages/states/store.ts';

const secondsToHms = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export const columns: ColumnDef<TodoEntity>[] = [
  {
    accessorKey: 'title',
    header: () => <div className='text-left'>Title</div>,
    cell: ({ row }) => {
      const title = String(row.getValue('title'));
      const done = row.original.done;
      let className = '';
      if (done) {
        className = 'line-through opacity-50';
      }
      return <div className={`text-left ${className}`}>{title}</div>;
    },
  },
  {
    accessorKey: 'timeSpent',
    header: () => <div className='text-right'>Spent</div>,
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));
      const value = secondsToHms(timeSpent);
      const done = row.original.done;
      let className = '';
      if (done) {
        className = 'line-through opacity-50';
      }
      return <div className={`text-right font-medium ${className}`}>{value}</div>;
    },
  },
];
