import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

export const materialsInitialState = {
	page: 0,
	pageSize: 10,
	searchText: '',

	typeFilter: 'all',
	glassTypeFilter: 'all',
	dateFromFilter: '',
	dateToFilter: ''
};

export const materialsAppSlice = createSlice({
	name: 'materialsApp',
	initialState: materialsInitialState,
	reducers: {
		resetMaterials: () => materialsInitialState,
		newMaterialsInstance: {
			reducer: (state, action) => action.payload,
			prepare: (event) => ({
				payload: {
					...materialsInitialState
				}
			})
		},
		setMaterialsPage: {
			reducer: (state, action) => {
				state.page = action.payload;
			},
			prepare: (event) => ({ payload: event || 0 })
		},
		setMaterialsPageSize: {
			reducer: (state, action) => {
				state.pageSize = action.payload;
			},
			prepare: (event) => ({ payload: event || 10 })
		},
		setMaterialsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: (event) => ({ payload: event.target.value || '' })
		},

		setMaterialsTypeFilter: {
			reducer: (state, action) => {
				state.typeFilter = action.payload;
			},
			prepare: (event) => ({ payload: event.target.value || 'all' })
		},
		setMaterialsGlassTypeFilter: {
			reducer: (state, action) => {
				state.glassTypeFilter = action.payload;
			},
			prepare: (event) => ({ payload: event.target.value || 'all' })
		},
		setMaterialsDateFromFilter: {
			reducer: (state, action) => {
				state.dateFromFilter = action.payload;
			},
			prepare: (event) => ({ payload: event || null })
		},
		setMaterialsDateToFilter: {
			reducer: (state, action) => {
				state.dateToFilter = action.payload;
			},
			prepare: (event) => ({ payload: event || null })
		}
	},
	selectors: {
		selectMaterialsPage: (materialsApp) => materialsApp.page,
		selectMaterialsPageSize: (materialsApp) => materialsApp.pageSize,
		selectMaterialsSearchText: (materialsApp) => materialsApp.searchText,

		selectMaterialsTypeFilter: (materialsApp) => materialsApp.typeFilter,
		selectMaterialsGlassTypeFilter: (materialsApp) => materialsApp.glassTypeFilter,
		selectMaterialsDateFromFilter: (materialsApp) => materialsApp.dateFromFilter,
		selectMaterialsDateToFilter: (materialsApp) => materialsApp.dateToFilter
	}
});
/**
 * Lazy load
 * */
rootReducer.inject(materialsAppSlice);
const injectedSlice = materialsAppSlice.injectInto(rootReducer);
export const {
	resetMaterials,
	newMaterialsInstance,
	setMaterialsPage,
	setMaterialsPageSize,
	setMaterialsSearchText,

	setMaterialsTypeFilter,
	setMaterialsGlassTypeFilter,
	setMaterialsDateFromFilter,
	setMaterialsDateToFilter
} = materialsAppSlice.actions;
export const {
	selectMaterialsPage,
	selectMaterialsPageSize,
	selectMaterialsSearchText,

	selectMaterialsTypeFilter,
	selectMaterialsGlassTypeFilter,
	selectMaterialsDateFromFilter,
	selectMaterialsDateToFilter
} = injectedSlice.selectors;

export default materialsAppSlice.reducer;
