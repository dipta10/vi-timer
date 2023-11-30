import axios from 'axios';
import { TimeTracking } from '@/pages/states/store.ts';
import moment from 'moment';
import { TimelineRow } from '@/components/types/timeline.ts';

export function fetchTimeline(
  setTimeline: (tracks: TimeTracking[]) => void,
  setTimelineRows: (tracks: TimelineRow[]) => void,
) {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/todo/timeline`)
    .then(({ data }) => {
      data = sanitizeTracksResponse(data);
      processTracksResponse(data, setTimelineRows);
      data.push({
        title: 'dummmy',
        startTime: new Date(),
        endTime: new Date(),
        todo: {
          title: 'dummmy',
        },
      });
      setTimeline(data);
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

function processTracksResponse(
  data: any,
  setTimelineRows: (tracks: TimelineRow[]) => void,
) {
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
    const dayRow: TimelineRow = {
      title: moment(dateStr, keyDateFormat).format('Do MMM, Y'),
      totalTimeSpent: 0,
      type: 'day',
    };
    timelineRows.push(dayRow);

    for (const todoId of Object.keys(dates[dateStr])) {
      const tracks = dates[dateStr][todoId];
      const todoRow: TimelineRow = {
        title: tracks[0].todo.title,
        totalTimeSpent: 0,
        type: 'todo',
      };
      timelineRows.push(todoRow);
      for (const track of tracks) {
        if (!track.endTime) {
          console.log(`track with todo id ${todoId} is running`);
          continue;
        }
        const diff = track.endTime.getTime() - track.startTime.getTime();
        dayRow.totalTimeSpent += diff / 1000;
        todoRow.totalTimeSpent += diff / 1000;
      }

      todoRow.totalTimeSpent = Math.ceil(todoRow.totalTimeSpent);

      console.log(
        `total time spent for todoId ${todoId} is ${dayRow.totalTimeSpent}s`,
      );
    }
    dayRow.totalTimeSpent = Math.ceil(dayRow.totalTimeSpent);
  }

  setTimelineRows(timelineRows);

  return data;
}
