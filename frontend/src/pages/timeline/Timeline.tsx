import '../../App.css';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Timeline() {
  useEffect(() => {
    axios
      .get('http://localhost:8000/todo/timeline')
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <ModeToggle />
      <Link
        className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
        to='/'
      >
        Todo List
      </Link>
      hello from the timeline
    </>
  );
}

export default Timeline;
