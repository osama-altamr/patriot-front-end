import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const ordersInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  priorityFilter: "all",
  statusFilter: "all",
  userIdFilter: null,
  driverIdFilter: null,
  dateFromFilter: "",
  dateToFilter: "",
};

export const ordersAppSlice = createSlice({
  name: "ordersApp",
  initialState: ordersInitialState,
  reducers: {
    resetOrders: () => ordersInitialState,
    newOrdersInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...ordersInitialState,
        },
      }),
    },
    setOrdersPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setOrdersPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setOrdersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setOrdersPriorityFilter: {
      reducer: (state, action) => {
        state.priorityFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setOrdersStatusFilter: {
      reducer: (state, action) => {
        state.statusFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setOrdersUserIdFilter: {
      reducer: (state, action) => {
        state.userIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setOrdersDriverIdFilter: {
      reducer: (state, action) => {
        state.driverIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setOrdersDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setOrdersDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectOrdersPage: (ordersApp) => ordersApp.page,
    selectOrdersPageSize: (ordersApp) => ordersApp.pageSize,
    selectOrdersSearchText: (ordersApp) => ordersApp.searchText,
    selectOrdersPriorityFilter: (ordersApp) => ordersApp.priorityFilter,
    selectOrdersStatusFilter: (ordersApp) => ordersApp.statusFilter,
    selectOrdersUserIdFilter: (ordersApp) => ordersApp.userIdFilter,
    selectOrdersDriverIdFilter: (ordersApp) => ordersApp.driverIdFilter,
    selectOrdersDateFromFilter: (ordersApp) => ordersApp.dateFromFilter,
    selectOrdersDateToFilter: (ordersApp) => ordersApp.dateToFilter,
  },
});

rootReducer.inject(ordersAppSlice);
const injectedSlice = ordersAppSlice.injectInto(rootReducer);

export const {
  resetOrders,
  newOrdersInstance,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersSearchText,
  setOrdersPriorityFilter,
  setOrdersStatusFilter,
  setOrdersUserIdFilter,
  setOrdersDriverIdFilter,
  setOrdersDateFromFilter,
  setOrdersDateToFilter,
} = ordersAppSlice.actions;

export const {
  selectOrdersPage,
  selectOrdersPageSize,
  selectOrdersSearchText,
  selectOrdersPriorityFilter,
  selectOrdersStatusFilter,
  selectOrdersUserIdFilter,
  selectOrdersDriverIdFilter,
  selectOrdersDateFromFilter,
  selectOrdersDateToFilter,
} = injectedSlice.selectors;

export default ordersAppSlice.reducer;