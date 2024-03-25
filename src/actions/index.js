import { heroesFetched, heroesFetching, heroesFetchingError } from '../redux/slices/heroesSlice';

export const fetchHeroes = request => dispatch => {
	dispatch(heroesFetching());
	request('https://65feb3a3b2a18489b3866fc2.mockapi.io/api/heroes')
		.then(data => dispatch(heroesFetched(data)))
		.catch(() => dispatch(heroesFetchingError()));
};

export const filtersFetching = () => {
	return {
		type: 'FILTERS_FETCHING',
	};
};

export const filtersFetched = filters => {
	return {
		type: 'FILTERS_FETCHED',
		payload: filters,
	};
};

export const filtersFetchingError = () => {
	return {
		type: 'FILTERS_FETCHING_ERROR',
	};
};

export const activeFilterChanged = filter => {
	return {
		type: 'ACTIVE_FILTER_CHANGED',
		payload: filter,
	};
};
