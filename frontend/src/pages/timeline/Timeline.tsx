import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tab, useTabStore, useTodoStore } from '@/pages/states/store.ts';
import { TrackList } from '@/pages/timeline/track-list.tsx';
import { fetchTimeline } from '@/utils/timeline.utils.ts';
import { trackColumnsByDay } from '@/pages/timeline/track-colums-by-day.tsx';
import { Navbar } from '@/components/Navbar.tsx';

function Timeline() {
  const navigate = useNavigate();
  useHotkeys(`c`, () => navigate('/'));
  const { setTimeline, setTimelineRows, timelineRows } = useTodoStore();
  const { setTab } = useTabStore();
  useEffect(() => {
    setTab(Tab.TIMELINE);
    fetchTimeline(setTimeline, setTimelineRows);
  }, []);

  return (
    <div className='container mx-auto py-10'>
      <Navbar />
      <div>
        <TrackList columns={trackColumnsByDay} data={timelineRows} />
      </div>
    </div>
  );
}

export default Timeline;
