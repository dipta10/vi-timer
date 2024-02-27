import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
import { ViTable } from '@/components/custom/vi-table.tsx';
import { Tab, useTabStore, WithId } from '@/pages/states/store.ts';
import {
  ColumnDef,
  getCoreRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

export interface DialogOption extends WithId {
  value: string;
  action?: () => void;
}

const optionsDialogColumns: ColumnDef<DialogOption>[] = [
  {
    accessorKey: 'value',
    header: () => <div className='text-left font-bold'>Select Action</div>,
    cell: ({ row }) => {
      return (
        <div
          className={`text-left flex flex-row gap-2 content-center items-center`}
        >
          {row.getValue('value')}
        </div>
      );
    },
  },
];

interface OptionsDialogProps {
  open: boolean;
  setOpen: any;
  options: DialogOption[];
  title?: string;
}

export function OptionsDialog({
  open,
  setOpen,
  options,
  title,
}: OptionsDialogProps) {
  const [rowSelection, setRowSelection] = useState({});
  const { popTab } = useTabStore();

  function onSelectRow(option: DialogOption) {
    if (option.action) {
      popTab();
      option.action();
      setOpen(false);
    }
  }

  if (title) {
    optionsDialogColumns[0].header = () => (
      <div className='text-left font-bold'>{title}</div>
    );
  } else {
    optionsDialogColumns[0].header = () => (
      <div className='text-left font-bold'>Select Action</div>
    );
  }

  const table: Table<DialogOption> = useReactTable({
    data: options,
    columns: optionsDialogColumns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {
      rowSelection: rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const onOpenChange = () => {
    setOpen((p: boolean) => !p);
    popTab();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='border-0 bg-transparent'>
        <ViTable
          tabName={Tab.OPEN_DIALOG}
          reactTable={table}
          onSelectRow={onSelectRow}
        />
      </DialogContent>
    </Dialog>
  );
}
