import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const complaintsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  typeFilter: "all",
statusFilter: "all",
userIdFilter: null,
closedByIdFilter: null,
  dateFromFilter: "",
  dateToFilter: "",
};

export const complaintsAppSlice = createSlice({
  name: "complaintsApp",
  initialState: complaintsInitialState,
  reducers: {
    resetComplaints: () => complaintsInitialState,
    newComplaintsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...complaintsInitialState,
        },
      }),
    },
    setComplaintsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setComplaintsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setComplaintsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setComplaintsTypeFilter: {
      reducer: (state, action) => {
        state.typeFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
setComplaintsStatusFilter: {
      reducer: (state, action) => {
        state.statusFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
setComplaintsUserIdFilter: {
      reducer: (state, action) => {
        state.userIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
setComplaintsClosedByIdFilter: {
      reducer: (state, action) => {
        state.closedByIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setComplaintsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setComplaintsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectComplaintsPage: (complaintsApp) => complaintsApp.page,
    selectComplaintsPageSize: (complaintsApp) => complaintsApp.pageSize,
    selectComplaintsSearchText: (complaintsApp) => complaintsApp.searchText,
    
    selectComplaintsTypeFilter: (complaintsApp) => complaintsApp.typeFilter,
selectComplaintsStatusFilter: (complaintsApp) => complaintsApp.statusFilter,
selectComplaintsUserIdFilter: (complaintsApp) => complaintsApp.userIdFilter,
selectComplaintsClosedByIdFilter: (complaintsApp) => complaintsApp.closedByIdFilter,
    selectComplaintsDateFromFilter: (complaintsApp) => complaintsApp.dateFromFilter,
    selectComplaintsDateToFilter: (complaintsApp) => complaintsApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(complaintsAppSlice);
const injectedSlice = complaintsAppSlice.injectInto(rootReducer);
export const {
  resetComplaints,
  newComplaintsInstance,
  setComplaintsPage,
  setComplaintsPageSize,
  setComplaintsSearchText,
  
  setComplaintsTypeFilter,
setComplaintsStatusFilter,
setComplaintsUserIdFilter,
setComplaintsClosedByIdFilter,
  setComplaintsDateFromFilter,
  setComplaintsDateToFilter,
} = complaintsAppSlice.actions;
export const {
  selectComplaintsPage,
  selectComplaintsPageSize,
  selectComplaintsSearchText,
  
  selectComplaintsTypeFilter,
selectComplaintsStatusFilter,
selectComplaintsUserIdFilter,
selectComplaintsClosedByIdFilter,
  selectComplaintsDateFromFilter,
  selectComplaintsDateToFilter,
} = injectedSlice.selectors;

export default complaintsAppSlice.reducer;
