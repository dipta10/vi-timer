import { create } from 'zustand';

export enum Tab {
  TASK_LIST,
  EDIT_TASK,
  ADD_TASK,
}

export type TodoEntity = {
  id: number;
  title: string;
  description?: string;
  status: boolean;
  timeSpent: number;
  done: boolean;
  running: boolean;
  startTime?: Date;
};

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

export const useTabStore = create<TabState>()((set) => ({
  currentTab: Tab.TASK_LIST,
  tabHistory: [Tab.TASK_LIST],
  setTab: (tab) =>
    set(() => {
      return {
        currentTab: tab,
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
}));

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  timeline: [],
  // runningTodo: undefined,
  setTodos: (todos) =>
    set((state) => {
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
}));
