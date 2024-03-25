import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const initialState = {
	filters: [],
	filtersLoadingStatus: 'idle',
	activeFilter: 'all',
};

export const fetchFilters = createAsyncThunk('filters/fetchFilters', async () => {
	const { request } = useHttp();
	return await request('https://65feb3a3b2a18489b3866fc2.mockapi.io/api/filters');
});

const filtersSlice = createSlice({
	name: 'filters',
	initialState: initialState,
	reducers: {
		activeFilterChanged: (state, action) => {
			state.activeFilter = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchFilters.pending, state => {
				state.filtersLoadingStatus = 'loading';
			})
			.addCase(fetchFilters.fulfilled, (state, action) => {
				state.filtersLoadingStatus = 'idle';
				state.filters = action.payload;
			})
			.addCase(fetchFilters.rejected, state => {
				state.filtersLoadingStatus = 'error';
			});
	},
});

const { actions, reducer } = filtersSlice;
export default reducer;
export const { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } = actions;
