import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const operationsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  currentStageIdFilter: "all",
  dateFromFilter: "",
  dateToFilter: "",
};

export const operationsAppSlice = createSlice({
  name: "operationsApp",
  initialState: operationsInitialState,
  reducers: {
    resetOperations: () => operationsInitialState,
    newOperationsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...operationsInitialState,
        },
      }),
    },
    setOperationsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setOperationsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setOperationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setOperationsCurrentStageIdFilter: {
      reducer: (state, action) => {
        state.currentStageIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setOperationsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setOperationsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectOperationsPage: (operationsApp) => operationsApp.page,
    selectOperationsPageSize: (operationsApp) => operationsApp.pageSize,
    selectOperationsSearchText: (operationsApp) => operationsApp.searchText,
    
    selectOperationsCurrentStageIdFilter: (operationsApp) => operationsApp.currentStageIdFilter,
    selectOperationsDateFromFilter: (operationsApp) => operationsApp.dateFromFilter,
    selectOperationsDateToFilter: (operationsApp) => operationsApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(operationsAppSlice);
const injectedSlice = operationsAppSlice.injectInto(rootReducer);
export const {
  resetOperations,
  newOperationsInstance,
  setOperationsPage,
  setOperationsPageSize,
  setOperationsSearchText,
  
  setOperationsCurrentStageIdFilter,
  setOperationsDateFromFilter,
  setOperationsDateToFilter,
} = operationsAppSlice.actions;
export const {
  selectOperationsPage,
  selectOperationsPageSize,
  selectOperationsSearchText,
  
  selectOperationsCurrentStageIdFilter,
  selectOperationsDateFromFilter,
  selectOperationsDateToFilter,
} = injectedSlice.selectors;

export default operationsAppSlice.reducer;
