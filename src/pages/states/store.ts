import { create } from 'zustand';

export enum Tab {
  TASK_LIST,
  EDIT_TASK,
  ADD_TASK,
}

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
