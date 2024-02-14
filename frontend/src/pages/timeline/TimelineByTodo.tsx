import { ViTable } from '@/components/custom/vi-table';
import { Tab } from '../states/store';
import {
  ColumnDef,
  Table,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Track } from '@/components/types/timeline';
import { useState } from 'react';
import { secondsToHms } from '@/utils/time.utils';

const todoColumns: ColumnDef<Track>[] = [
  {
    accessorKey: 'value',
    header: () => <div className='text-left font-bold'>Time Spent</div>,
    cell: ({ row }) => {
      console.log('row is', row);
      const totalTimeInSeconds =
        row.original.endTime.getTime() - row.original.startTime.getTime();
      // const totalTimeInSeconds = row.original.endTime - row.original.startTime;
      const timeStr = secondsToHms(totalTimeInSeconds / 1000);
      return (
        <div
          className={`text-left flex flex-row gap-2 content-center items-center`}
        >
          {timeStr} - {row.original.startTime.toLocaleTimeString()} -{' '}
          {row.original.endTime.toLocaleTimeString()}
        </div>
      );
    },
  },
];

export function TracksByTodo({ tracks }: { tracks: Track[] }) {
  const [rowSelection, setRowSelection] = useState({});

  const table: Table<Track> = useReactTable({
    data: tracks,
    columns: todoColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const doSomething = (row: Track) => {
    console.log(row);
  };

  return (
    <ViTable
      tabName={Tab.TRACK_LIST_BY_TODO}
      reactTable={table}
      onSelectRow={doSomething}
    />
  );
}
