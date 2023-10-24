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
import {
  Tab,
  TodoEntity,
  useTabStore,
  useTodoStore,
} from '@/pages/states/store.ts';
import axios from 'axios';
import { fetchRunningTodo } from "@/utils/todo.utils.ts";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TValue>({
  columns,
  data,
}: DataTableProps<TodoEntity, TValue>) {
  // https://tanstack.com/table/v8/docs/examples/react/row-selection
  const [rowSelection, setRowSelection] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoEntity | null>(null);
  const [selectedRowRef, setSelectedRowRef] =
    useState<HTMLTableRowElement | null>(null);
  const { currentTab, pushTab } = useTabStore();
  const { toggleTodo, toggleTimer, setRunningTodo } = useTodoStore();
  const [toggling, setToggling] = useState(false);

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
    enabled: currentTab === Tab.TASK_LIST,
  });
  useHotkeys('up, k', () => onPressUp(), {
    enabled: currentTab === Tab.TASK_LIST,
  });
  useHotkeys(`e, ${Key.Enter}`, () => onOpenDialog(), {
    enabled: currentTab === Tab.TASK_LIST,
    preventDefault: true,
  });
  useHotkeys(
    `space`,
    () => {
      // because of duplicate key activation
      // https://github.com/JohannesKlauss/react-hotkeys-hook/issues/1013
      setToggling(true);
      const found = getSelectedTodo();
      if (!found) {
        throw new Error('todo not found for toggling done');
      }
      toggleTodo(found.id);
      toggleDoneApi(found);
      setToggling(false);
    },
    {
      enabled: currentTab === Tab.TASK_LIST,
      ignoreEventWhen: () => {
        return toggling;
      },
    },
  );
  useHotkeys(
    't',
    () => {
      // because of duplicate key activation
      // https://github.com/JohannesKlauss/react-hotkeys-hook/issues/1013
      setToggling(true);
      const found = getSelectedTodo();
      if (!found) {
        throw new Error('todo not found for toggling done');
      }
      toggleTimer(found.id);
      toggleTimerApi(found);
      // setRunningTodo(found);
      setToggling(false);
    },
    {
      enabled: currentTab === Tab.TASK_LIST,
      ignoreEventWhen: () => {
        return toggling;
      },
    },
  );

  const getSelectedTodo = () => {
    const rowModel = table.getSelectedRowModel();
    const row = rowModel.rows[0];
    const id = row.original.id;
    return data.find((d) => d.id === id);
  };

  const onOpenDialog = () => {
    const found = getSelectedTodo();
    if (found) {
      setSelectedTodo(found);
    }
    setDialogOpen(true);
    pushTab(Tab.ADD_TASK);
  };

  const toggleDoneApi = (value: Partial<TodoEntity>) => {
    axios
      .put(`http://localhost:8000/todo/${value.id}/toggle-done`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const toggleTimerApi = (value: Partial<TodoEntity>) => {
    axios
      .post(`http://localhost:8000/todo/${value.id}/toggle-timer`, {})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const editTodo = (value: Partial<TodoEntity>) => {
    axios
      .put(`http://localhost:8000/todo/${value.id}`, value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
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
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={row.getIsSelected() ? 'active-input' : ''}
                  ref={(el) =>
                    row.getIsSelected() ? setSelectedRowRef(el) : null
                  }
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
