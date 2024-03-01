import axios from '@/utils/config';
import { TimeEntry } from '@/pages/states/store.ts';
import moment from 'moment';
import { TimelineRow } from '@/components/types/timeline.ts';

export function fetchTimeline(
  setTimeEntries: (tracks: TimeEntry[]) => void,
  setTimelineRows: (tracks: TimelineRow[]) => void,
) {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/todo/timeline`)
    .then(({ data }) => {
      data = sanitizeTracksResponse(data);
      const timelineRows = processTracksResponse(data);
      setTimelineRows(timelineRows);
      setTimeEntries(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function sanitizeTracksResponse(data: any) {
  data = data.map((d: any) => {
    d.startTime = new Date(d.startTime);
    if (d.endTime) d.endTime = new Date(d.endTime);
    return d;
  });

  return data;
}

export function processTracksResponse(
  data: TimeEntry[],
): TimelineRow[] {
  const dates: any = {};
  const keyDateFormat = 'Y-M-D';

  for (const t of data) {
    const day = moment(t.startTime).format(keyDateFormat);
    const todo = t.todo;
    if (!dates[day]) {
      dates[day] = {};
    }
    if (!dates[day][todo.id]) {
      dates[day][todo.id] = [];
    }
    dates[day][todo.id].push(t);
  }

  const timelineRows: TimelineRow[] = [];
  const sortedDates = Object.keys(dates)
    .map((t) => new Date(t))
    .sort((a: any, b: any) => a - b)
    .reverse()
    .map((d) => moment(d).format(keyDateFormat));

  for (const dateStr of sortedDates) {
    const dayStr = moment(dateStr, keyDateFormat).format('Do MMM, Y');
    const dayRow: TimelineRow = {
      id: dayStr,
      title: dayStr,
      totalTimeSpent: 0,
      type: 'day',
      timeEntryRows: [],
    };
    timelineRows.push(dayRow);

    for (const todoId of Object.keys(dates[dateStr])) {
      const timeEntries = dates[dateStr][todoId];
      const todoRow: TimelineRow = {
        id: `${dateStr}-${todoId}`,
        title: timeEntries[0].todo.title,
        totalTimeSpent: 0,
        type: 'todo',
        timeEntryRows: timeEntries,
      };
      timelineRows.push(todoRow);
      for (const timeEntry of timeEntries) {
        if (!timeEntry.endTime) {
          continue;
        }
        const diff =
          timeEntry.endTime.getTime() - timeEntry.startTime.getTime();
        dayRow.totalTimeSpent += diff / 1000;
        todoRow.totalTimeSpent += diff / 1000;
      }

      todoRow.totalTimeSpent = Math.ceil(todoRow.totalTimeSpent);
    }
    dayRow.totalTimeSpent = Math.ceil(dayRow.totalTimeSpent);
  }

  return timelineRows;
}
