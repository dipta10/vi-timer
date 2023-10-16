import { Payment, columns } from './columns';
import { DataTable } from './data-table';

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      title: 'react - get the basics',
    },
    {
      id: '728ed523',
      amount: 100,
      status: 'pending',
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
