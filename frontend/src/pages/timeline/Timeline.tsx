import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tab, useTabStore, useTodoStore } from '@/pages/states/store.ts';
import { TrackList } from '@/pages/timeline/track-list.tsx';
import { fetchTimeline } from '@/utils/timeline.utils.ts';
import { trackColumnsByDay } from '@/pages/timeline/track-colums-by-day.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { TimelineRow } from '@/components/types/timeline';
import { TracksByTodo } from './TimelineByTodo';

function Timeline() {
  const navigate = useNavigate();
  const { setTimeline, setTimelineRows, timelineRows } = useTodoStore();
  const { setTab } = useTabStore();
  const [isTrackSelected, setIsTrackSelected] = useState(false);
  const [selectedTimelineRow, setSelectedTimelineRow] =
    useState<TimelineRow | null>(null);

  useHotkeys(`c`, () => navigate('/'));
  useHotkeys(`Esc`, () => {
    setIsTrackSelected(false);
    setTab(Tab.TIMELINE);
  });
  useEffect(() => {
    setTab(Tab.TIMELINE);
    fetchTimeline(setTimeline, setTimelineRows);
  }, []);

  const onSelectRow = (data: TimelineRow) => {
    if (!data.tracks) return;
    setSelectedTimelineRow(data);
    setIsTrackSelected(true);
    console.log('onSelectRow', data.tracks);
    setTab(Tab.TRACK_LIST_BY_TODO);
  };

  return (
    <div className='container mx-auto py-10'>
      <Navbar />
      <div>
        {!isTrackSelected && (
          <TrackList
            columns={trackColumnsByDay}
            data={timelineRows}
            onSelectRow={onSelectRow}
          />
        )}
        {isTrackSelected && (
          <h3>
            {selectedTimelineRow?.title +
              ' ' +
              selectedTimelineRow?.totalTimeSpent}
          </h3>
        )}
        {isTrackSelected && selectedTimelineRow?.tracks && (
          <TracksByTodo tracks={selectedTimelineRow?.tracks} />
        )}
      </div>
    </div>
  );
}

export default Timeline;
