import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const stagesInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  
  dateFromFilter: "",
  dateToFilter: "",
};

export const stagesAppSlice = createSlice({
  name: "stagesApp",
  initialState: stagesInitialState,
  reducers: {
    resetStages: () => stagesInitialState,
    newStagesInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...stagesInitialState,
        },
      }),
    },
    setStagesPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setStagesPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setStagesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    
    setStagesDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setStagesDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectStagesPage: (stagesApp) => stagesApp.page,
    selectStagesPageSize: (stagesApp) => stagesApp.pageSize,
    selectStagesSearchText: (stagesApp) => stagesApp.searchText,
    
    
    selectStagesDateFromFilter: (stagesApp) => stagesApp.dateFromFilter,
    selectStagesDateToFilter: (stagesApp) => stagesApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(stagesAppSlice);
const injectedSlice = stagesAppSlice.injectInto(rootReducer);
export const {
  resetStages,
  newStagesInstance,
  setStagesPage,
  setStagesPageSize,
  setStagesSearchText,
  
  
  setStagesDateFromFilter,
  setStagesDateToFilter,
} = stagesAppSlice.actions;
export const {
  selectStagesPage,
  selectStagesPageSize,
  selectStagesSearchText,
  
  
  selectStagesDateFromFilter,
  selectStagesDateToFilter,
} = injectedSlice.selectors;

export default stagesAppSlice.reducer;
