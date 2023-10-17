import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Todo = {
  id: string;
  timeSpent: number;
  status: boolean;
  title: string;
  focused?: boolean;
};

export type TodoColumns = {
  id: string;
  timeSpent: number;
  status: boolean;
  title: string;
};

export const columns: ColumnDef<TodoColumns>[] = [
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
      const email = String(row.getValue('title'));
      const focused = (row.original as Todo).focused;
      return <div className='text-left font-medium'>{email} - {focused ? 'focused': 'not focused'}</div>;
    },
  },
  {
    accessorKey: 'timeSpent',
    header: () => <div className='text-right'>Spent</div>,
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));
      return <div className='text-right font-medium'>{timeSpent}</div>;
    },
  }
];
