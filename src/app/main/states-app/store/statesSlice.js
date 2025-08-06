import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const statesInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  activeFilter: "all",
  
  dateFromFilter: "",
  dateToFilter: "",
};

export const statesAppSlice = createSlice({
  name: "statesApp",
  initialState: statesInitialState,
  reducers: {
    resetStates: () => statesInitialState,
    newStatesInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...statesInitialState,
        },
      }),
    },
    setStatesPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setStatesPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setStatesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setStatesActiveFilter: {
      reducer: (state, action) => {
        state.activeFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    
    setStatesDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setStatesDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectStatesPage: (statesApp) => statesApp.page,
    selectStatesPageSize: (statesApp) => statesApp.pageSize,
    selectStatesSearchText: (statesApp) => statesApp.searchText,
    selectStatesActiveFilter: (statesApp) => statesApp.activeFilter,
    
    selectStatesDateFromFilter: (statesApp) => statesApp.dateFromFilter,
    selectStatesDateToFilter: (statesApp) => statesApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(statesAppSlice);
const injectedSlice = statesAppSlice.injectInto(rootReducer);
export const {
  resetStates,
  newStatesInstance,
  setStatesPage,
  setStatesPageSize,
  setStatesSearchText,
  setStatesActiveFilter,
  
  setStatesDateFromFilter,
  setStatesDateToFilter,
} = statesAppSlice.actions;
export const {
  selectStatesPage,
  selectStatesPageSize,
  selectStatesSearchText,
  selectStatesActiveFilter,
  
  selectStatesDateFromFilter,
  selectStatesDateToFilter,
} = injectedSlice.selectors;

export default statesAppSlice.reducer;
