import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import classNames from 'classnames';
import { useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import { filtersFetched, filtersFetchingError, activeFilterChanged, filtersFetching } from '../../redux/slices/filtersSlice.js';

const HeroesFilters = () => {
	const { filters, filtersLoadingStatus, activeFilter } = useSelector(state => state.filters);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(filtersFetching());
		request('https://65feb3a3b2a18489b3866fc2.mockapi.io/api/filters')
			.then(data => dispatch(filtersFetched(data)))
			.catch(() => dispatch(filtersFetchingError()));
	}, [request, dispatch]);

	if (filtersLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (filtersLoadingStatus === 'error') {
		return <h5 className='text-center mt-5'>Ошибка загрузки</h5>;
	}

	const renderFilters = arr => {
		if (arr.length === 0) {
			return <h5 className='text-center mt-5'>Фильтры не найдены</h5>;
		}

		return arr.map(({ name, className, label }) => {
			const btnClass = classNames('btn', className, {
				active: name === activeFilter,
			});

			return (
				<button
					key={name}
					id={name}
					className={btnClass}
					onClick={() => dispatch(activeFilterChanged(name))}
				>
					{label}
				</button>
			);
		});
	};

	const elements = renderFilters(filters);

	return (
		<div className='card shadow-lg mt-4'>
			<div className='card-body'>
				<p className='card-text'>Отфильтруйте героев по элементам</p>
				<div className='btn-group'>{elements}</div>
			</div>
		</div>
	);
};

export default HeroesFilters;
