import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const categoriesInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  
  dateFromFilter: "",
  dateToFilter: "",
};

export const categoriesAppSlice = createSlice({
  name: "categoriesApp",
  initialState: categoriesInitialState,
  reducers: {
    resetCategories: () => categoriesInitialState,
    newCategoriesInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...categoriesInitialState,
        },
      }),
    },
    setCategoriesPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setCategoriesPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setCategoriesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    
    setCategoriesDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setCategoriesDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectCategoriesPage: (categoriesApp) => categoriesApp.page,
    selectCategoriesPageSize: (categoriesApp) => categoriesApp.pageSize,
    selectCategoriesSearchText: (categoriesApp) => categoriesApp.searchText,
    
    
    selectCategoriesDateFromFilter: (categoriesApp) => categoriesApp.dateFromFilter,
    selectCategoriesDateToFilter: (categoriesApp) => categoriesApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(categoriesAppSlice);
const injectedSlice = categoriesAppSlice.injectInto(rootReducer);
export const {
  resetCategories,
  newCategoriesInstance,
  setCategoriesPage,
  setCategoriesPageSize,
  setCategoriesSearchText,
  
  
  setCategoriesDateFromFilter,
  setCategoriesDateToFilter,
} = categoriesAppSlice.actions;
export const {
  selectCategoriesPage,
  selectCategoriesPageSize,
  selectCategoriesSearchText,
  
  
  selectCategoriesDateFromFilter,
  selectCategoriesDateToFilter,
} = injectedSlice.selectors;

export default categoriesAppSlice.reducer;
