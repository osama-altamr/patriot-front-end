import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const usersInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  roleFilter: "all",
  dateFromFilter: "",
  dateToFilter: "",
};

export const usersAppSlice = createSlice({
  name: "usersApp",
  initialState: usersInitialState,
  reducers: {
    resetUsers: () => usersInitialState,
    newUsersInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...usersInitialState,
        },
      }),
    },
    setUsersPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setUsersPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setUsersRoleFilter: {
      reducer: (state, action) => {
        state.roleFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setUsersDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setUsersDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectUsersPage: (usersApp) => usersApp.page,
    selectUsersPageSize: (usersApp) => usersApp.pageSize,
    selectUsersSearchText: (usersApp) => usersApp.searchText,
    
    selectUsersRoleFilter: (usersApp) => usersApp.roleFilter,
    selectUsersDateFromFilter: (usersApp) => usersApp.dateFromFilter,
    selectUsersDateToFilter: (usersApp) => usersApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(usersAppSlice);
const injectedSlice = usersAppSlice.injectInto(rootReducer);
export const {
  resetUsers,
  newUsersInstance,
  setUsersPage,
  setUsersPageSize,
  setUsersSearchText,
  
  setUsersRoleFilter,
  setUsersDateFromFilter,
  setUsersDateToFilter,
} = usersAppSlice.actions;
export const {
  selectUsersPage,
  selectUsersPageSize,
  selectUsersSearchText,
  
  selectUsersRoleFilter,
  selectUsersDateFromFilter,
  selectUsersDateToFilter,
} = injectedSlice.selectors;

export default usersAppSlice.reducer;
