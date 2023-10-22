import { create } from 'zustand';

export enum Tab {
  TASK_LIST,
  EDIT_TASK,
  ADD_TASK,
}

export type TodoEntity = {
  id: string;
  title: string;
  description?: string;
  status: boolean;
  timeSpent: number;
};

export type TodoState = {
  todos: TodoEntity[];
  setTodos: (todos: TodoEntity[]) => void;
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
}));
