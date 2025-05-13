// redux/features/layout/layoutSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubTabType = "default" | "recommended" | "chathistory";
export type CenterViewMode = "chat" | "dashboard" | "insight" | null;

interface LayoutState {
  sidebarVisible: boolean;
  activeSidebarTab: SubTabType;
  activePage: string;
  centerViewMode: CenterViewMode;
}

const initialState: LayoutState = {
  sidebarVisible: true,
  activeSidebarTab: "default",
  activePage: "Home",
  centerViewMode: null,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setSidebarVisible(state, action: PayloadAction<boolean>) {
      state.sidebarVisible = action.payload;
    },
    setActiveSidebarTab(state, action: PayloadAction<SubTabType>) {
      state.activeSidebarTab = action.payload;
    },
    setActivePage(state, action: PayloadAction<string>) {
      state.activePage = action.payload;
    },
    setCenterViewMode(state, action: PayloadAction<CenterViewMode>) {
      state.centerViewMode = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarVisible,
  setActiveSidebarTab,
  setActivePage,
  setCenterViewMode,
} = layoutSlice.actions;

export default layoutSlice.reducer;
