import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

export const productsInitialState = {
  page: 0,
  pageSize: 10,
  searchText: "",
  
  categoryIdFilter: null,
  dateFromFilter: "",
  dateToFilter: "",
};

export const productsAppSlice = createSlice({
  name: "productsApp",
  initialState: productsInitialState,
  reducers: {
    resetProducts: () => productsInitialState,
    newProductsInstance: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          ...productsInitialState,
        },
      }),
    },
    setProductsPage: {
      reducer: (state, action) => {
        state.page = action.payload;
      },
      prepare: (event) => ({ payload: event || 0 }),
    },
    setProductsPageSize: {
      reducer: (state, action) => {
        state.pageSize = action.payload;
      },
      prepare: (event) => ({ payload: event || 10 }),
    },
    setProductsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
    
    setProductsCategoryIdFilter: {
      reducer: (state, action) => {
        state.categoryIdFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setProductsDateFromFilter: {
      reducer: (state, action) => {
        state.dateFromFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
    setProductsDateToFilter: {
      reducer: (state, action) => {
        state.dateToFilter = action.payload;
      },
      prepare: (event) => ({ payload: event || null }),
    },
  },
  selectors: {
    selectProductsPage: (productsApp) => productsApp.page,
    selectProductsPageSize: (productsApp) => productsApp.pageSize,
    selectProductsSearchText: (productsApp) => productsApp.searchText,
    
    selectProductsCategoryIdFilter: (productsApp) => productsApp.categoryIdFilter,
    selectProductsDateFromFilter: (productsApp) => productsApp.dateFromFilter,
    selectProductsDateToFilter: (productsApp) => productsApp.dateToFilter,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(productsAppSlice);
const injectedSlice = productsAppSlice.injectInto(rootReducer);
export const {
  resetProducts,
  newProductsInstance,
  setProductsPage,
  setProductsPageSize,
  setProductsSearchText,
  
  setProductsCategoryIdFilter,
  setProductsDateFromFilter,
  setProductsDateToFilter,
} = productsAppSlice.actions;
export const {
  selectProductsPage,
  selectProductsPageSize,
  selectProductsSearchText,
  
  selectProductsCategoryIdFilter,
  selectProductsDateFromFilter,
  selectProductsDateToFilter,
} = injectedSlice.selectors;

export default productsAppSlice.reducer;
