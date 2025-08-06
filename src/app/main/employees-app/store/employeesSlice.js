import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const employeesInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  userIdFilter: null,
stageIdFilter: null,
accessTypeFilter: "all",
  dateFromFilter: "",
  dateToFilter: "",
};

export const employeesAppSlice = createSlice({
  name: "employeesApp",
  initialState: employeesInitialState,
  reducers: {
    resetEmployees: () => employeesInitialState,
    newEmployeesInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...employeesInitialState,
        },
      }),
    },
    setEmployeesPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setEmployeesPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setEmployeesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setEmployeesUserIdFilter: {
      reducer: (state, action) => {
        state.userIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
setEmployeesStageIdFilter: {
      reducer: (state, action) => {
        state.stageIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
setEmployeesAccessTypeFilter: {
      reducer: (state, action) => {
        state.accessTypeFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setEmployeesDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setEmployeesDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectEmployeesPage: (employeesApp) => employeesApp.page,
    selectEmployeesPageSize: (employeesApp) => employeesApp.pageSize,
    selectEmployeesSearchText: (employeesApp) => employeesApp.searchText,
    
    selectEmployeesUserIdFilter: (employeesApp) => employeesApp.userIdFilter,
selectEmployeesStageIdFilter: (employeesApp) => employeesApp.stageIdFilter,
selectEmployeesAccessTypeFilter: (employeesApp) => employeesApp.accessTypeFilter,
    selectEmployeesDateFromFilter: (employeesApp) => employeesApp.dateFromFilter,
    selectEmployeesDateToFilter: (employeesApp) => employeesApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(employeesAppSlice);
const injectedSlice = employeesAppSlice.injectInto(rootReducer);
export const {
  resetEmployees,
  newEmployeesInstance,
  setEmployeesPage,
  setEmployeesPageSize,
  setEmployeesSearchText,
  
  setEmployeesUserIdFilter,
setEmployeesStageIdFilter,
setEmployeesAccessTypeFilter,
  setEmployeesDateFromFilter,
  setEmployeesDateToFilter,
} = employeesAppSlice.actions;
export const {
  selectEmployeesPage,
  selectEmployeesPageSize,
  selectEmployeesSearchText,
  
  selectEmployeesUserIdFilter,
selectEmployeesStageIdFilter,
selectEmployeesAccessTypeFilter,
  selectEmployeesDateFromFilter,
  selectEmployeesDateToFilter,
} = injectedSlice.selectors;

export default employeesAppSlice.reducer;
