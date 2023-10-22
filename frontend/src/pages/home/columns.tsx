import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Todo = {
  id: string;
  timeSpent: number;
  status: boolean;
  title: string;
};

// Function to convert seconds to formatted time
const secondsToHms = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const done: boolean = row.getValue('status');
      return (
        <div className='text-left'>
          <Checkbox checked={done} />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: () => <div className='text-left'>Title</div>,
    cell: ({ row }) => {
      const title = String(row.getValue('title'));
      return (
        <div className='text-left'>
          {title}
          {/*show this on hover*/}
        </div>
      );
    },
  },
  {
    accessorKey: 'timeSpent',
    header: () => <div className='text-right'>Spent</div>,
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));
      const value = secondsToHms(timeSpent);
      return <div className='text-right font-medium'>{value}</div>;
    },
  },
];
