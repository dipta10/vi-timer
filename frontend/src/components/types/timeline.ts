import { WithId } from "@/pages/states/store";

export type TimelineRow = {
  title: string;
  totalTimeSpent: number;
  type: 'todo' | 'day';
  tracks?: Track[];
};

// export type TracksApiResponse = {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   todoId: string;
//   startTime: string;
//   endTime: string;
//   todo: Todo;
// };

export interface Track extends WithId {
  value: string;
  startTime: Date;
  endTime: Date;
  // id: string;
  // createdAt: string;
  // updatedAt: string;
  // title: string;
  // description: string;
  // done: boolean;
  // timeSpent: number;
  // isDeleted: boolean;
  // running: boolean;
  // userId: string;
}
