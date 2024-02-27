import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TimelineRow } from '@/components/types/timeline.ts';

export enum Tab {
  TASK_LIST = 'TASK_LIST',
  EDIT_TASK = 'EDIT_TASK',
  ADD_TASK = 'ADD_TASK',
  TIMELINE = 'TIMELINE',
  OPEN_DIALOG = 'OPEN_DIALOG',
  TIME_ENTRY_BY_TODO = 'TIME_ENTRY_BY_TODO',
}

export interface WithId {
  id: number;
}

export interface TodoEntity {
  id: number;
  title: string;
  description?: string;
  status: boolean;
  timeSpent: number;
  done: boolean;
  running: boolean;
  startTime?: Date;
  updatedAt: Date;
  createdAt: Date;
}

export type TimeTracking = {
  id: string;
  startTime: Date;
  endTime: Date;
  todo: TodoEntity;
};

export type TodoState = {
  todos: TodoEntity[];
  runningTodo?: TodoEntity;
  setTodos: (todos: TodoEntity[]) => void;
  toggleTodo: (id: number) => void;
  toggleTimer: (id: number) => void;
  timeline: TimeTracking[];
  timelineRows: TimelineRow[];
  setTimelineRows: (timelineRows: TimelineRow[]) => void;
  setTimeline: (tracks: TimeTracking[]) => void;
  setRunningTodo: (todo: TodoEntity) => void;
};

export interface TabState {
  currentTab: Tab;
  tabHistory: Tab[];
  setTab: (tab: Tab) => void;
  pushTab: (tab: Tab) => void;
  popTab: () => void;
}

export const useTabStore = create<TabState>()(
  devtools((set) => ({
    currentTab: Tab.TASK_LIST,
    tabHistory: [Tab.TASK_LIST],
    setTab: (tab) =>
      set(() => {
        return {
          currentTab: tab,
          tabHistory: [tab],
        };
      }),
    pushTab: (tab) =>
      set((state) => {
        return {
          currentTab: tab,
          tabHistory: [...state.tabHistory, tab],
        };
      }),
    popTab: () =>
      set(({ tabHistory }) => {
        const tab = tabHistory[tabHistory.length - 2];
        return {
          currentTab: tab,
          tabHistory: tabHistory.slice(0, tabHistory.length - 1),
        };
      }),
  })),
);

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      timeline: [],
      timelineRows: [],
      // runningTodo: undefined,
      setTodos: (todos) =>
        set((state) => {
          todos = todos.map((t) => {
            t.createdAt = new Date(t.createdAt);
            t.updatedAt = new Date(t.updatedAt);
            return t;
          });
          return {
            ...state,
            todos: todos,
          };
        }),
      toggleTodo: (id) => {
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (!todo) return state;

          todo.done = !todo.done;
          todo.updatedAt = new Date();
          return {
            ...state,
            todos: [...state.todos],
          };
        });
      },
      toggleTimer: (id) => {
        set((state) => {
          const todos = state.todos.map((todo) => {
            if (todo.id === id) {
              todo.running = !todo.running;
            } else {
              todo.running = false;
            }
            return todo;
          });
          let found: TodoEntity | undefined = todos.find((t) => t.id === id);
          if (found) found.updatedAt = new Date();
          if (found?.running) {
            found.startTime = new Date();
          } else {
            found = undefined;
          }

          return {
            ...state,
            todos: [...todos],
            runningTodo: found,
          };
        });
      },
      setRunningTodo: (todo) =>
        set((state) => {
          return {
            ...state,
            runningTodo: todo,
          };
        }),
      setTimeline: (tracks) =>
        set((state) => {
          return {
            ...state,
            timeline: tracks,
          };
        }),
      setTimelineRows: (rows) =>
        set((state) => {
          return {
            ...state,
            timelineRows: rows,
          };
        }),
    }),
    { trace: 'tabs' },
  ),
);

export interface SessionState {
  accessToken?: string;
  name?: string;
  isLoggedIn: boolean;
  setTokenAndName: (accessToken: string, name: string) => void;
  updateAccessToken: () => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      isLoggedIn: false,
      setTokenAndName: (accessToken: string, name: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('name', name);
        set(() => {
          return {
            accessToken,
            name,
            isLoggedIn: true,
          };
        });
      },
      clearSession: () => {
        localStorage.clear();
        set(() => {
          return {
            accessToken: '',
            name: '',
            isLoggedIn: false,
          };
        });
      },
      updateAccessToken: () => {
        const accessToken = localStorage.getItem('accessToken') as string;
        const name = localStorage.getItem('name') as string;
        set(() => {
          return {
            accessToken,
            name,
            isLoggedIn: !!accessToken,
          };
        });
      },
    }),
    { trace: 'session' },
  ),
);
