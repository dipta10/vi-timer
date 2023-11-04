import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Table as ReactTable,
} from '@tanstack/react-table';
import { Tab, TodoEntity, useTabStore, WithId } from '@/pages/states/store.ts';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';

interface ViTableProp<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tabName: Tab;
  reactTable: ReactTable<TData>;
  onSelectRow: (data: TData) => void;
}

export function ViTable<TData extends WithId, TValue>({
  columns,
  data,
  tabName,
  onSelectRow,
  reactTable: table,
}: ViTableProp<TData, TValue>) {
  // https://tanstack.com/table/v8/docs/examples/react/row-selection
  const [rowSelection, setRowSelection] = useState({});
  const [selectedTodo, setSelectedTodo] = useState<TData | undefined>(
    undefined,
  );
  const [selectedRowRef, setSelectedRowRef] =
    useState<HTMLTableRowElement | null>(null);
  const { currentTab } = useTabStore();

  useEffect(() => {
    if (data.length != 0) {
      table.setRowSelection({ 0: true });
    }
  }, [data.length]);

  // useEffect to scroll to the selected tr element when the component mounts
  useEffect(() => {
    selectedRowRef?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [selectedRowRef]);

  const onPressDown = () => {
    // const selected = parseInt(Object.keys(rowSelection)[0]);
    // const selected = table.getSelectedRowModel().rows[0];
    const selected = table.getSelectedRowModel().flatRows[0].index;
    // setRowSelection({ [(selected + 1) % data.length]: true });
    table.setRowSelection({ [(selected + 1) % data.length]: true });
  };

  const onPressUp = () => {
    const selected = table.getSelectedRowModel().flatRows[0].index;
    table.setRowSelection({ [(selected - 1 + data.length) % data.length]: true });
  };

  useHotkeys(`${Key.ArrowDown}, j`, () => onPressDown(), {
    enabled: currentTab === tabName,
  });
  useHotkeys('up, k', () => onPressUp(), {
    enabled: currentTab === tabName,
  });
  useHotkeys(
    `e, ${Key.Enter}`,
    () => {
      selectRow();
    },
    {
      enabled: currentTab === tabName,
      preventDefault: true,
    },
  );

  function selectRow() {
    const selectedData = getSelectedTodo();
    if (!selectedData) {
      throw new Error('selected data can not be found!');
    }
    onSelectRow(selectedData);
  }

  const getSelectedTodo = () => {
    const rowModel = table.getSelectedRowModel();
    const row = rowModel.rows[0];
    const id = row.original.id;
    return data.find((d) => d.id === id);
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
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={row.getIsSelected() ? 'active-input' : ''}
                  ref={(el) =>
                    row.getIsSelected() ? setSelectedRowRef(el) : null
                  }
                  onClick={() => {
                    table.setRowSelection({});
                    row.toggleSelected();
                    selectRow();
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
    </div>
  );
}
