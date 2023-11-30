// TODO move this to todo-list page
import { ColumnDef } from '@tanstack/react-table';
import { TodoEntity } from '@/pages/states/store.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { secondsToHms } from '@/utils/time.utils.ts';
import { CurrentTodoTimer } from '@/components/CurrentTodoTimer.tsx';

export const todoColumns: ColumnDef<TodoEntity>[] = [
  {
    accessorKey: 'title',
    header: () => <div className='text-left font-bold'>Title</div>,
    cell: ({ row }) => {
      const title = String(row.getValue('title'));
      const done = row.original.done;
      const running = row.original.running;
      let className = '';
      if (done) {
        className = 'line-through opacity-50';
      }
      return (
        <div
          className={`text-left ${className} flex flex-row gap-2 content-center items-center`}
        >
          {running && (
            <FontAwesomeIcon
              style={{
                fontSize: 'x-large',
                color: 'brown',
              }}
              className='fa-beat'
              icon={faClock}
            />
          )}
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: 'timeSpent',
    header: () => (
      <div className='text-right font-bold' style={{ minWidth: '100px' }}>
        Spent
      </div>
    ),
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));
      const value = secondsToHms(timeSpent);
      const done = row.original.done;
      const running = row.original.running;
      let className = '';
      if (done) {
        className = 'line-through opacity-50';
      }
      return (
        <div className={`text-right font-medium`}>
          <div className={className}>{value}</div>
          {running && <CurrentTodoTimer />}
        </div>
      );
    },
  },
];
