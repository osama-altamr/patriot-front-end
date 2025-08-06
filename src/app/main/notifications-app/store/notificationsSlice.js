import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const notificationsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  isSeenFilter: "all",
  dateFromFilter: "",
  dateToFilter: "",
  panelState: false,
};

export const notificationsAppSlice = createSlice({
  name: "notificationsApp",
  initialState: notificationsInitialState,
  reducers: {
    resetNotifications: () => notificationsInitialState,
    newNotificationsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...notificationsInitialState,
        },
      }),
    },
    setNotificationsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setNotificationsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setNotificationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setNotificationsIsSeenFilter: {
      reducer: (state, action) => {
        state.isSeenFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },

    setNotificationsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setNotificationsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    toggleNotificationsPanel: (state) => {
      state.panelState = !state.panelState;
      return state;
    },
    openNotificationsPanel: (state) => {
      state.panelState = true;
      return state;
    },
    closeNotificationsPanel: (state) => {
      state.panelState = false;
      return state;
    },
  },
  selectors: {
    selectNotificationsPage: (notificationsApp) => notificationsApp.page,
    selectNotificationsPageSize: (notificationsApp) =>
      notificationsApp.pageSize,
    selectNotificationsSearchText: (notificationsApp) =>
      notificationsApp.searchText,
    selectNotificationsIsSeenFilter: (notificationsApp) =>
      notificationsApp.isSeenFilter,
    selectNotificationsDateFromFilter: (notificationsApp) =>
      notificationsApp.dateFromFilter,
    selectNotificationsDateToFilter: (notificationsApp) =>
      notificationsApp.dateToFilter,
    selectNotificationsPanelState: (notificationsApp) =>
      notificationsApp.panelState,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(notificationsAppSlice);
const injectedSlice = notificationsAppSlice.injectInto(rootReducer);
export const {
  resetNotifications,
  newNotificationsInstance,
  setNotificationsPage,
  setNotificationsPageSize,
  setNotificationsSearchText,
  setNotificationsIsSeenFilter,
  setNotificationsDateFromFilter,
  setNotificationsDateToFilter,
  toggleNotificationsPanel,
  openNotificationsPanel,
  closeNotificationsPanel,
} = notificationsAppSlice.actions;
export const {
  selectNotificationsPage,
  selectNotificationsPageSize,
  selectNotificationsSearchText,
  selectNotificationsIsSeenFilter,
  selectNotificationsDateFromFilter,
  selectNotificationsDateToFilter,
  selectNotificationsPanelState,
} = injectedSlice.selectors;

export default notificationsAppSlice.reducer;
