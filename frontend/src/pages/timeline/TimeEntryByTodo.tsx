import { ViTable } from '@/components/custom/vi-table';
import { Tab } from '../states/store';
import {
  ColumnDef,
  Table,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TimeEntryRow } from '@/components/types/timeline';
import { useState } from 'react';
import { secondsToHms } from '@/utils/time.utils';

const todoColumns: ColumnDef<TimeEntryRow>[] = [
  {
    accessorKey: 'value',
    header: () => <div className='text-left font-bold'>Time Spent</div>,
    cell: ({ row }) => {
      const totalTimeInSeconds =
        row.original.endTime.getTime() - row.original.startTime.getTime();
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

export function TimeEntryByTodo({
  tracks,
  onSelectTimeEntry,
}: {
  tracks: TimeEntryRow[];
  onSelectTimeEntry: (row: TimeEntryRow) => void;
}) {
  const [rowSelection, setRowSelection] = useState({});

  const table: Table<TimeEntryRow> = useReactTable({
    data: tracks,
    columns: todoColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <ViTable
      tabName={Tab.TIME_ENTRY_BY_TODO}
      reactTable={table}
      onSelectRow={onSelectTimeEntry}
    />
  );
}
