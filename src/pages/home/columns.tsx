import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Todo = {
  id: string;
  timeSpent: number;
  status: boolean;
  title: string;
};

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <div className='text-left'>{String(row.getValue('status'))}</div>;
    },
  },
  {
    accessorKey: 'title',
    header: () => <div className='text-left'>Email</div>,
    cell: ({ row }) => {
      const email = String(row.getValue('title'));

      return <div className='text-left font-medium'>{email}</div>;
    },
  },
  {
    accessorKey: 'timeSpent',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));

      return <div className='text-right font-medium'>{timeSpent}</div>;
    },
  },
];
