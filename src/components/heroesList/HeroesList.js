import { useHttp } from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroes, filteredHeroesSelector } from '../../redux/slices/heroesSlice';
import { heroDeleted } from '../../redux/slices/heroesSlice';
import HeroesListItem from '../heroesListItem/HeroesListItem';
import Spinner from '../spinner/Spinner';

const HeroesList = () => {
	const filteredHeroes = useSelector(filteredHeroesSelector);
	const { heroesLoadingStatus } = useSelector(state => state.heroes);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes());
	}, [dispatch]);

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
