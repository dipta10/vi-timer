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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // https://tanstack.com/table/v8/docs/examples/react/row-selection
  const [rowSelection, setRowSelection] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rowSelection: rowSelection,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    if (data.length != 0) {
      setRowSelection({ 0: true });
    }
  }, [data.length]);

  const onClickDown = () => {
    const selected = parseInt(Object.keys(rowSelection)[0]);
    setRowSelection({ [(selected + 1) % data.length]: true });
  };

  const onClickUp = () => {
    const selected = parseInt(Object.keys(rowSelection)[0]);
    setRowSelection({ [(selected - 1 + data.length) % data.length]: true });
  };

  useHotkeys('down', () => onClickDown());
  useHotkeys('j', () => onClickDown());
  useHotkeys('up', () => onClickUp());
  useHotkeys('k', () => onClickUp());
  useHotkeys('e', () => onOpenDialog());

  const onOpenDialog = () => {
    const rowModel = table.getSelectedRowModel();
    const row = rowModel.rows[0];
    const title = row.getValue('title');
    setSelectedTitle(title as string);
    setDialogOpen(true);
  };

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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={row.getIsSelected() ? 'bg-slate-800' : ''}
                onClick={() => {
                  setRowSelection({});
                  row.toggleSelected();
                  onOpenDialog();
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  // console.log(`${row.getValue('title')} - ${row.getIsSelected()}`);
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
            ))
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
        title={selectedTitle}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </div>
  );
}
