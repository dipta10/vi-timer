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
      focused: false,
    },
    {
      id: '728ed523',
      timeSpent: 100,
      status: false,
      title: 'python - unit testing',
      focused: true,
    },
    // ...
  ];
}

export default function Home() {
  const data = getData();
  console.log('data is', data);

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
