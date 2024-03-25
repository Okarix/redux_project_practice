import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
	heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', async () => {
	const { request } = useHttp();
	return await request('https://65feb3a3b2a18489b3866fc2.mockapi.io/api/heroes');
});

const heroesSlice = createSlice({
	name: 'heroes',
	initialState: initialState,
	reducers: {
		heroCreated: (state, action) => {
			heroesAdapter.addOne(state, action.payload);
		},
		heroDeleted: (state, action) => {
			heroesAdapter.removeOne(state, action.payload);
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchHeroes.pending, state => {
				state.heroesLoadingStatus = 'loading';
			})
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				state.heroesLoadingStatus = 'idle';
				heroesAdapter.setAll(state, action.payload);
			})
			.addCase(fetchHeroes.rejected, state => {
				state.heroesLoadingStatus = 'error';
			})
			.addDefaultCase(() => {});
	},
});

const { actions, reducer } = heroesSlice;
export default reducer;
export const { selectAll } = heroesAdapter.getSelectors(state => state.heroes);
export const { heroesFetching, heroesFetched, heroesFetchingError, heroCreated, heroDeleted } = actions;
