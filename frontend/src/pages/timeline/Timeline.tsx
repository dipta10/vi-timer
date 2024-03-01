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
import axios from '@/utils/config';

function Timeline() {
  const navigate = useNavigate();
  const {
    setTimeEntries,
    setTimelineRows,
    timelineRows,
    deleteTimeEntry,
    timeEntries,
  } = useTodoStore();
  const { setTab, pushTab, currentTab, popTab } = useTabStore();
  const [isTodoSelected, setIsTodoSelected] = useState(false);
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
      setIsTodoSelected(false);
      setTab(Tab.TIMELINE);
    },
    {
      enabled: currentTab === Tab.TIME_ENTRY_BY_TODO,
    },
  );
  useEffect(() => {
    setTab(Tab.TIMELINE);
    fetchTimeline(setTimeEntries, setTimelineRows);
  }, []);

  useEffect(() => {
    if (selectedTimelineRow) {
      const updatedRow = timelineRows.find(
        (row) => row.id === selectedTimelineRow.id,
      );
      if (!updatedRow) {
        setIsTodoSelected(false);
        popTab();
      }
      setSelectedTimelineRow(updatedRow ? updatedRow : null);
    }
  }, [timeEntries]);

  const onSelectTimeline = (data: TimelineRow) => {
    if (!data.timeEntryRows) return;
    setSelectedTimelineRow(data);
    setIsTodoSelected(true);
    pushTab(Tab.TIME_ENTRY_BY_TODO);
  };

  const options: DialogOption[] = [
    {
      id: 1,
      value: 'Yes',
      action: () => {
        const id = selectedTimeEntry?.id;
        if (!id) return;
        axios
          .delete(`${import.meta.env.VITE_BACKEND_URL}/time-entry/${id}`)
          .then(() => {
            deleteTimeEntry(id as string);
          });
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
            onSelectRow={onSelectTimeline}
          />
        )}
        {isTodoSelected && selectedTimelineRow?.timeEntryRows && (
          <TimeEntryByTodo
            timelineRow={selectedTimelineRow}
            timeEntryRows={selectedTimelineRow?.timeEntryRows}
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
