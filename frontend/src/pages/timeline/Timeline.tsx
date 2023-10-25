import '../../App.css';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTodoStore } from '@/pages/states/store.ts';
import { TrackList } from '@/pages/timeline/track-list.tsx';
import { trackColumns } from '@/pages/timeline/track-columns.tsx';

function Timeline() {
  const navigate = useNavigate();
  useHotkeys(`c`, () => navigate('/'));
  const { timeline, setTimeline } = useTodoStore();
  useEffect(() => {
    axios
      .get('http://localhost:8000/todo/timeline')
      .then(({ data }) => {
        data = data.map((d: any) => {
          d.startTime = new Date(d.startTime);
          if (d.endTime) d.endTime = new Date(d.endTime);
          return d;
        });
        console.log('data', data);
        setTimeline(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {timeline.length > 0 && timeline[0].startTime.toLocaleTimeString()}
      <ModeToggle />
      <Link
        className='border rounded-md px-4 py-2 bg-white text-slate-900 text-sm'
        to='/'
      >
        Todo List
      </Link>
      <br/>
      All time entries in past 7 days
      <TrackList columns={trackColumns} data={timeline} />
    </>
  );
}

export default Timeline;
