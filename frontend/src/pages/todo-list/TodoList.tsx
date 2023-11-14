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
import {
  DialogOption,
  OptionsDialog,
} from '@/components/custom/OptionsDialog.tsx';
import { fetchTodos } from '@/utils/todo.utils.ts';

export function TodoList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const { setTodos, toggleTimer, toggleTodo, todos } = useTodoStore();
  const [selectedTodo, setSelectedTodo] = useState<TodoEntity | null>(null);
  const { currentTab, pushTab, popTab } = useTabStore();
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchTodos(setTodos);
  }, []);

  const onEditTodo = () => {
    setDialogOpen(true);
    pushTab(Tab.ADD_TASK);
    // setOptionsDialogOpen(false);
  };

  const onSelectTodo = (todo: TodoEntity) => {
    console.log(todo);
    setOptionsDialogOpen(true);
    setSelectedTodo(todo);
    pushTab(Tab.OPEN_DIALOG);
  };

  const getSelectedTodo = () => {
    const rowModel = table.getSelectedRowModel();
    const row = rowModel.rows[0];
    const id = row.original.id;
    return todos.find((d) => d.id === id);
  };

  const onToggleTodoTimer = () => {
    const found = getSelectedTodo();
    if (!found) {
      throw new Error('todo not found for toggling done');
    }
    toggleTimer(found.id);
    toggleTimerApi(found);
    const prevOptionsDialogOpen = optionsDialogOpen;
    setTimeout(() => {
      if (prevOptionsDialogOpen) {
        // setRowSelection({ 0: true });
      }
    });
  };

  const onToggleTodoStatus = () => {
    const found = getSelectedTodo();
    if (!found) {
      throw new Error('todo not found for toggling done');
    }
    toggleTodo(found.id);
    toggleDoneApi(found);
  }

  useHotkeys(
    't',
    () => {
      // because of duplicate key activation
      // https://github.com/JohannesKlauss/react-hotkeys-hook/issues/1013
      setToggling(true);
      onToggleTodoTimer();
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
        fetchTodos(setTodos);
        setRowSelection({ [0]: true });
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

  const options: DialogOption[] = [
    { id: 1, value: 'Edit Todo', action: onEditTodo },
    { id: 2, value: 'Toggle Timer', action: onToggleTodoTimer },
    { id: 3, value: 'Toggle Status', action: onToggleTodoStatus},
  ];

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
      <OptionsDialog
        options={options}
        open={optionsDialogOpen}
        setOpen={setOptionsDialogOpen}
      />
    </>
  );
}
