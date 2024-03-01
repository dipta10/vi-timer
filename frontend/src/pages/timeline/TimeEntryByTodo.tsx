import { ViTable } from '@/components/custom/vi-table';
import { Tab } from '../states/store';
import {
  ColumnDef,
  Table,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TimeEntryRow, TimelineRow } from '@/components/types/timeline';
import { useEffect, useState } from 'react';
import { secondsToHms } from '@/utils/time.utils';

const todoColumns: ColumnDef<TimeEntryRow>[] = [
  {
    accessorKey: 'timeSpent',
    header: () => <div className='text-left font-bold'>Time Entries</div>,
    cell: ({ row }) => {
      let timeStr = 'Still running';
      let running = true;
      if (row.original.endTime) {
        const totalTimeInSeconds =
          row.original.endTime.getTime() - row.original.startTime.getTime();
        timeStr = secondsToHms(Math.round(totalTimeInSeconds / 1000));
        running = false;
      }
      return (
        <div
          className={`text-left flex flex-row gap-2 content-center items-center`}
        >
          {running && (
            <div className='animate-pulse w-4 h-4 bg-red-500 rounded-full duration-1000'></div>
          )}
          {!running && timeStr}
        </div>
      );
    },
  },
  {
    accessorKey: 'startTime',
    header: () => <div className='text-right font-bold'>Start Time</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        {row.original.startTime.toLocaleTimeString()}
      </div>
    ),
  },
  {
    accessorKey: 'endTime',
    header: () => <div className='text-right font-bold'>End Time</div>,
    cell: ({ row }) => (
      <div className='text-right'>
        {row.original.endTime?.toLocaleTimeString() || 'Still running'}
      </div>
    ),
  },
];

export function TimeEntryByTodo({
  timeEntryRows: timeEntryRows,
  timelineRow: timelineRow,
  onSelectTimeEntry,
}: {
  timeEntryRows: TimeEntryRow[];
  timelineRow: TimelineRow;
  onSelectTimeEntry: (row: TimeEntryRow) => void;
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [timeSpentStr, setTimeSpentStr] = useState('');

  const table: Table<TimeEntryRow> = useReactTable({
    data: timeEntryRows,
    columns: todoColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    setTimeSpentStr(secondsToHms(timelineRow.totalTimeSpent));
  }, [timeEntryRows]);

  return (
    <>
      <div className='flex gap-2 border-l border-l-amber-50 text-left px-5 font-bold my-3'>
        <h1>Todo Name: {timelineRow?.title}</h1>
      </div>
      <ViTable
        tabName={Tab.TIME_ENTRY_BY_TODO}
        reactTable={table}
        onSelectRow={onSelectTimeEntry}
      />
      <div className="font-bold flex justify-end my-3">
        <h2>Total Time Spent: {timeSpentStr}</h2>
      </div>
    </>
  );
}
