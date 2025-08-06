import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const reportsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  typeFilter: "all",
  dateFromFilter: "",
  dateToFilter: "",
};

export const reportsAppSlice = createSlice({
  name: "reportsApp",
  initialState: reportsInitialState,
  reducers: {
    resetReports: () => reportsInitialState,
    newReportsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...reportsInitialState,
        },
      }),
    },
    setReportsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setReportsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setReportsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setReportsTypeFilter: {
      reducer: (state, action) => {
        state.typeFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setReportsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setReportsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectReportsPage: (reportsApp) => reportsApp.page,
    selectReportsPageSize: (reportsApp) => reportsApp.pageSize,
    selectReportsSearchText: (reportsApp) => reportsApp.searchText,
    
    selectReportsTypeFilter: (reportsApp) => reportsApp.typeFilter,
    selectReportsDateFromFilter: (reportsApp) => reportsApp.dateFromFilter,
    selectReportsDateToFilter: (reportsApp) => reportsApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(reportsAppSlice);
const injectedSlice = reportsAppSlice.injectInto(rootReducer);
export const {
  resetReports,
  newReportsInstance,
  setReportsPage,
  setReportsPageSize,
  setReportsSearchText,
  
  setReportsTypeFilter,
  setReportsDateFromFilter,
  setReportsDateToFilter,
} = reportsAppSlice.actions;
export const {
  selectReportsPage,
  selectReportsPageSize,
  selectReportsSearchText,
  
  selectReportsTypeFilter,
  selectReportsDateFromFilter,
  selectReportsDateToFilter,
} = injectedSlice.selectors;

export default reportsAppSlice.reducer;
