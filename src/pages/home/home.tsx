import { Todo, columns } from './columns';
import { DataTable } from './data-table';

function getData(): Todo[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      timeSpent: 100,
      status: true,
      title: 'react - get the basics',
    },
    {
      id: '728ed523',
      timeSpent: 100,
      status: false,
      title: 'python - unit testing',
    },
    {
      id: '728ed525',
      timeSpent: 100,
      status: false,
      title: 'python - unit testing',
    },
    // ...
  ];
}

export default function Home() {
  const data = getData();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
