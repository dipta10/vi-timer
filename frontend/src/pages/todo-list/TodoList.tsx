import { ViTable } from '@/components/custom/vi-table.tsx';
import { useEffect, useState } from 'react';
import {
  Tab,
  TodoEntity,
  useTabStore,
  useTodoStore,
} from '@/pages/states/store.ts';
import { useHotkeys } from 'react-hotkeys-hook';
import axios from 'axios';
import { todoColumns } from '@/pages/home/todo-columns.tsx';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import { getCoreRowModel, Table, useReactTable } from '@tanstack/react-table';

export function TodoList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setTodos, toggleTimer, toggleTodo, todos } = useTodoStore();
  const [selectedTodo, setSelectedTodo] = useState<TodoEntity | null>(null);
  const { currentTab, pushTab } = useTabStore();
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/todo`)
      .then(({ data }) => {
        console.log(data);
        setTodos(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentTab]);

  const onSelectTodo = (todo: TodoEntity) => {
    console.log(todo);
    setDialogOpen(true);
    setSelectedTodo(todo);
    pushTab(Tab.ADD_TASK);
  };

  const getSelectedTodo = () => {
    const rowModel = table.getSelectedRowModel();
    const row = rowModel.rows[0];
    const id = row.original.id;
    return todos.find((d) => d.id === id);
  };

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

  const toggleDoneApi = (value: Partial<TodoEntity>) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/todo/${value.id}/toggle-done`,
        {},
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const toggleTimerApi = (value: Partial<TodoEntity>) => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/todo/${value.id}/toggle-timer`,
        {},
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const editTodo = (value: Partial<TodoEntity>) => {
    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/todo/${value.id}`, value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const [rowSelection, setRowSelection] = useState({});

  const table: Table<TodoEntity> = useReactTable({
    data: todos,
    columns: todoColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    setRowSelection({
      [0]: true,
    });
  }, []);

  return (
    <>
      <ViTable
        onSelectRow={onSelectTodo}
        tabName={Tab.TASK_LIST}
        reactTable={table}
      />
      <EditTaskDialog
        todo={selectedTodo as TodoEntity}
        open={dialogOpen}
        setOpen={setDialogOpen}
        onSubmitForm={editTodo}
      />
    </>
  );
}
