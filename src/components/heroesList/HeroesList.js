import { useHttp } from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted } from '../../actions';
import HeroesListItem from '../heroesListItem/HeroesListItem';
import Spinner from '../spinner/Spinner';
import { createSelector } from 'reselect';

const HeroesList = () => {
	const filteredHeroesSelector = createSelector(
		state => state.filters.activeFilter,
		state => state.heroes.heroes,
		(filter, heroes) => {
			if (filter === 'all') {
				return heroes;
			} else {
				return heroes.filter(hero => hero.element === filter);
			}
		}
	);

	const filteredHeroes = useSelector(filteredHeroesSelector);
	const { heroesLoadingStatus } = useSelector(state => state.heroes.heroesLoadingStatus);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(heroesFetching());
		request('https://65feb3a3b2a18489b3866fc2.mockapi.io/api/heroes')
			.then(data => dispatch(heroesFetched(data)))
			.catch(() => dispatch(heroesFetchingError()));
	}, [dispatch, request]);

	const onDelete = useCallback(
		id => {
			request(`https://65feb3a3b2a18489b3866fc2.mockapi.io/api/heroes/${id}`, 'DELETE')
				.then(data => console.log(data, 'Deleted'))
				.then(dispatch(heroDeleted(id)))
				.catch(err => console.error(err));
		},
		[request, dispatch]
	);

	if (heroesLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (heroesLoadingStatus === 'error') {
		return <h5 className='text-center mt-5'>Ошибка загрузки</h5>;
	}

	const renderHeroesList = arr => {
		if (arr.length === 0) {
			return <h5 className='text-center mt-5'>Героев пока нет</h5>;
		}

		return arr.map(({ id, ...props }) => {
			return (
				<HeroesListItem
					key={id}
					{...props}
					onDelete={() => onDelete(id)}
				/>
			);
		});
	};

	const elements = renderHeroesList(filteredHeroes);
	return <ul>{elements}</ul>;
};

export default HeroesList;
