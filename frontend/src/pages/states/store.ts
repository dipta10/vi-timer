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
};

export type TodoState = {
  todos: TodoEntity[];
  setTodos: (todos: TodoEntity[]) => void;
  toggleTodo: (id: number) => void;
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
  setTodos: (todos) =>
    set(() => {
      return {
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
}));
