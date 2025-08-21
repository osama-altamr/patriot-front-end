import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const stageDesignsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  
  dateFromFilter: "",
  dateToFilter: "",
};

export const stageDesignsAppSlice = createSlice({
  name: "stageDesignsApp",
  initialState: stageDesignsInitialState,
  reducers: {
    resetStageDesigns: () => stageDesignsInitialState,
    newStageDesignsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...stageDesignsInitialState,
        },
      }),
    },
    setStageDesignsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setStageDesignsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setStageDesignsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    
    setStageDesignsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setStageDesignsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectStageDesignsPage: (stageDesignsApp) => stageDesignsApp.page,
    selectStageDesignsPageSize: (stageDesignsApp) => stageDesignsApp.pageSize,
    selectStageDesignsSearchText: (stageDesignsApp) => stageDesignsApp.searchText,
    
    
    selectStageDesignsDateFromFilter: (stageDesignsApp) => stageDesignsApp.dateFromFilter,
    selectStageDesignsDateToFilter: (stageDesignsApp) => stageDesignsApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(stageDesignsAppSlice);
const injectedSlice = stageDesignsAppSlice.injectInto(rootReducer);
export const {
  resetStageDesigns,
  newStageDesignsInstance,
  setStageDesignsPage,
  setStageDesignsPageSize,
  setStageDesignsSearchText,
  
  
  setStageDesignsDateFromFilter,
  setStageDesignsDateToFilter,
} = stageDesignsAppSlice.actions;
export const {
  selectStageDesignsPage,
  selectStageDesignsPageSize,
  selectStageDesignsSearchText,
  
  
  selectStageDesignsDateFromFilter,
  selectStageDesignsDateToFilter,
} = injectedSlice.selectors;

export default stageDesignsAppSlice.reducer;
