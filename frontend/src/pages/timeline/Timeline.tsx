import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Tab, useTabStore, useTodoStore } from '@/pages/states/store.ts';
import { TrackList } from '@/pages/timeline/track-list.tsx';
import { fetchTimeline } from '@/utils/timeline.utils.ts';
import { trackColumnsByDay } from '@/pages/timeline/track-colums-by-day.tsx';
import { Navbar } from '@/components/Navbar.tsx';
import { TimelineRow, TimeEntryRow } from '@/components/types/timeline';
import { TimeEntryByTodo } from './TimeEntryByTodo';
import { DialogOption, OptionsDialog } from '@/components/custom/OptionsDialog';

function Timeline() {
  const navigate = useNavigate();
  const { setTimeline, setTimelineRows, timelineRows } = useTodoStore();
  const { setTab, pushTab, currentTab } = useTabStore();
  const [isTodoSelected, setTodoSelected] = useState(false);
  // const [isTimeEntrySelected, setTimeEntrySelected] = useState(false);
  const [selectedTimelineRow, setSelectedTimelineRow] =
    useState<TimelineRow | null>(null);
  const [selectedTimeEntry, setSelectedTimeEntry] =
    useState<TimeEntryRow | null>(null);
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);

  useHotkeys(`c`, () => navigate('/'), {
    enabled:
      currentTab === Tab.TIMELINE || currentTab === Tab.TIME_ENTRY_BY_TODO,
  });

  useHotkeys(
    `Esc`,
    () => {
      setTodoSelected(false);
      setTab(Tab.TIMELINE);
    },
    {
      enabled: currentTab === Tab.TIME_ENTRY_BY_TODO,
    },
  );
  useEffect(() => {
    setTab(Tab.TIMELINE);
    fetchTimeline(setTimeline, setTimelineRows);
  }, []);

  const onSelectTodo = (data: TimelineRow) => {
    if (!data.tracks) return;
    setSelectedTimelineRow(data);
    setTodoSelected(true);
    setTab(Tab.TIME_ENTRY_BY_TODO);
  };
  const options: DialogOption[] = [
    {
      id: 1,
      value: 'Yes',
      action: () => {
        console.log('delete entry', selectedTimeEntry?.id);
      },
    },
    {
      id: 2,
      value: 'No',
      action: () => {},
    },
  ];

  const onSelectTimeEntry = (timeEntry: TimeEntryRow) => {
    pushTab(Tab.OPEN_DIALOG);
    console.log('row is', timeEntry.id);
    setSelectedTimeEntry(timeEntry);
    setOptionsDialogOpen(true);
  };

  return (
    <div className='container mx-auto py-10'>
      <Navbar />
      <div>
        {!isTodoSelected && (
          <TrackList
            columns={trackColumnsByDay}
            data={timelineRows}
            onSelectRow={onSelectTodo}
          />
        )}
        {isTodoSelected && (
          <h3>
            {selectedTimelineRow?.title +
              ' ' +
              selectedTimelineRow?.totalTimeSpent}
          </h3>
        )}
        {isTodoSelected && selectedTimelineRow?.tracks && (
          <TimeEntryByTodo
            tracks={selectedTimelineRow?.tracks}
            onSelectTimeEntry={onSelectTimeEntry}
          />
        )}
        <OptionsDialog
          options={options}
          open={optionsDialogOpen}
          setOpen={setOptionsDialogOpen}
          title='Are you sure you want to delete this entry?'
        />
      </div>
    </div>
  );
}

export default Timeline;
