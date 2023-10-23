import { ColumnDef } from '@tanstack/react-table';
import { TodoEntity } from '@/pages/states/store.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';

const secondsToHms = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let ret = '';
  if (hours != 0) ret += ' ' + hours + 'h';
  if (minutes != 0 || hours != 0) ret += ' ' + minutes + 'm';
  ret += ' ' + remainingSeconds + 's';
  return ret;
};

export const columns: ColumnDef<TodoEntity>[] = [
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
              icon={faHourglassStart}
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
      <div className='text-right font-bold' style={{ width: '80px' }}>
        Spent
      </div>
    ),
    cell: ({ row }) => {
      const timeSpent = parseFloat(row.getValue('timeSpent'));
      const value = secondsToHms(timeSpent);
      const done = row.original.done;
      let className = '';
      if (done) {
        className = 'line-through opacity-50';
      }
      return (
        <div className={`text-right font-medium ${className}`}>{value}</div>
      );
    },
  },
];
