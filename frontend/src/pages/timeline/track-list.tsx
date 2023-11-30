import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import { Key } from 'ts-key-enum';
import { Tab, TodoEntity, useTabStore } from '@/pages/states/store.ts';
import { secondsToHms } from '@/utils/time.utils.ts';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TrackList<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // https://tanstack.com/table/v8/docs/examples/react/row-selection
  const [rowSelection, setRowSelection] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoEntity | null>(null);
  const [selectedRowRef, setSelectedRowRef] =
    useState<HTMLTableRowElement | null>(null);
  const { currentTab, pushTab } = useTabStore();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    if (data.length != 0) {
      setRowSelection({ 0: true });
    }
  }, [data.length]);

  const onPressDown = () => {
    const selected = parseInt(Object.keys(rowSelection)[0]);
    setRowSelection({ [(selected + 1) % data.length]: true });
  };
  const onPressUp = () => {
    const selected = parseInt(Object.keys(rowSelection)[0]);
    setRowSelection({ [(selected - 1 + data.length) % data.length]: true });
  };

  useHotkeys(`${Key.ArrowDown}, j`, () => onPressDown(), {
    enabled: currentTab === Tab.TIMELINE,
  });
  useHotkeys('up, k', () => onPressUp(), {
    enabled: currentTab === Tab.TIMELINE,
  });

  const editTodo = (value: Partial<TodoEntity>) => {
    console.log('value is', value);
  };

  // useEffect to scroll to the selected tr element when the component mounts
  useEffect(() => {
    selectedRowRef?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [selectedRowRef]);

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const type = (row.original as any).type;
              let className = '';
              if (row.getIsSelected()) className += ' active-input';
              if (type !== 'day')
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`${className}`}
                    ref={(el) =>
                      row.getIsSelected() ? setSelectedRowRef(el) : null
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );

              className += ' font-bold dark:bg-slate-900 bg-slate-300';
              const title = (row.original as any).title;
              const spent = (row.original as any).totalTimeSpent;
              const spentStr = secondsToHms(spent);
              console.log('total', title);
              console.log('spent', spentStr);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`${className}`}
                  ref={(el) =>
                    row.getIsSelected() ? setSelectedRowRef(el) : null
                  }
                >
                  <TableCell colSpan={columns.length} className='text-center'>
                    <div className='flex flex-row justify-center gap-4'>
                      <div>{title}</div>
                      <div>{spentStr}</div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No Todos Yet!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditTaskDialog
        todo={selectedTodo as TodoEntity}
        open={dialogOpen}
        setOpen={setDialogOpen}
        onSubmitForm={editTodo}
      />
    </div>
  );
}
