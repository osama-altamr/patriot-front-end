import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const citiesInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  activeFilter: "all",
  stateIdFilter: null,
  dateFromFilter: "",
  dateToFilter: "",
};

export const citiesAppSlice = createSlice({
  name: "citiesApp",
  initialState: citiesInitialState,
  reducers: {
    resetCities: () => citiesInitialState,
    newCitiesInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...citiesInitialState,
        },
      }),
    },
    setCitiesPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setCitiesPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setCitiesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    setCitiesActiveFilter: {
      reducer: (state, action) => {
        state.activeFilter = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "all" }),
    },
    setCitiesStateIdFilter: {
      reducer: (state, action) => {
        state.stateIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setCitiesDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setCitiesDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectCitiesPage: (citiesApp) => citiesApp.page,
    selectCitiesPageSize: (citiesApp) => citiesApp.pageSize,
    selectCitiesSearchText: (citiesApp) => citiesApp.searchText,
    selectCitiesActiveFilter: (citiesApp) => citiesApp.activeFilter,
    selectCitiesStateIdFilter: (citiesApp) => citiesApp.stateIdFilter,
    selectCitiesDateFromFilter: (citiesApp) => citiesApp.dateFromFilter,
    selectCitiesDateToFilter: (citiesApp) => citiesApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(citiesAppSlice);
const injectedSlice = citiesAppSlice.injectInto(rootReducer);
export const {
  resetCities,
  newCitiesInstance,
  setCitiesPage,
  setCitiesPageSize,
  setCitiesSearchText,
  setCitiesActiveFilter,
  setCitiesStateIdFilter,
  setCitiesDateFromFilter,
  setCitiesDateToFilter,
} = citiesAppSlice.actions;
export const {
  selectCitiesPage,
  selectCitiesPageSize,
  selectCitiesSearchText,
  selectCitiesActiveFilter,
  selectCitiesStateIdFilter,
  selectCitiesDateFromFilter,
  selectCitiesDateToFilter,
} = injectedSlice.selectors;

export default citiesAppSlice.reducer;
