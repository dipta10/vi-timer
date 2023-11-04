import { ViTable } from '@/components/custom/vi-table.tsx';
import { useEffect, useState } from 'react';
import {
  Tab,
  TodoEntity,
  useTabStore,
  useTodoStore,
} from '@/pages/states/store.ts';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';
import axios from 'axios';
import { fetchRunningTodo } from '@/utils/todo.utils.ts';
import { todoColumns } from '@/pages/home/todo-columns.tsx';
import { EditTaskDialog } from '@/components/custom/edit-task-dialog.tsx';
import { getCoreRowModel, Table, useReactTable } from '@tanstack/react-table';
import { data } from 'autoprefixer';

export function TodoListAlt() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setTodos, toggleTimer, todos } = useTodoStore();
  const [selectedTodo, setSelectedTodo] = useState<TodoEntity | null>(null);
  const { currentTab, pushTab } = useTabStore();
  const [toggling, setToggling] = useState(false);
  const navigate = useNavigate();

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
      const selectedTodo = getSelectedTodo();
      console.log('selected todo', selectedTodo);
      // because of duplicate key activation
      // https://github.com/JohannesKlauss/react-hotkeys-hook/issues/1013
      // TODO here let's move the table varilable in this object
      // and then pass the table varilable from this components?
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
        columns={todoColumns}
        data={todos}
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
