import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import AlertDialog from 'app/shared-components/alert-dialog/AlertDialog';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import localeString from 'src/app/main/utils/localeString';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import ICity from '../models/ICity';
import {
	newCitiesInstance,
	resetCities,
	selectCitiesDateFromFilter,
	selectCitiesDateToFilter,
	selectCitiesPage,
	selectCitiesPageSize,
	selectCitiesSearchText,
	setCitiesPage,
	setCitiesPageSize,
	selectCitiesActiveFilter,
	selectCitiesStateIdFilter
} from '../store/citiesSlice';
import { useGetCitiesQuery, useRemoveCityMutation, useUpdateCityMutation } from '../CitiesApi';

function CitiesTable() {
	const { t } = useTranslation('citiesApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);
	const [loadingActivateItem, setLoadingActivateItem] = useState(null);
	const [loadingDeactivateItem, setLoadingDeactivateItem] = useState(null);
	const page: number = useSelector(selectCitiesPage);
	const pageSize: number = useSelector(selectCitiesPageSize);
	const searchText: string | null = useSelector(selectCitiesSearchText);
	const activeFilter: string | null = useSelector(selectCitiesActiveFilter);
	const stateIdFilter: string | null = useSelector(selectCitiesStateIdFilter);
	const dateFromFilter: string | null = useSelector(selectCitiesDateFromFilter);
	const dateToFilter: string | null = useSelector(selectCitiesDateToFilter);

	const {
		data: cities,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetCitiesQuery(
		{
			page,
			pageSize,
			searchText,
			activeFilter,
			stateIdFilter,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeCity] = useRemoveCityMutation();
	const [updateCity] = useUpdateCityMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newCitiesInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetCities(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setCitiesPage(page));
		dispatch(setCitiesPageSize(pageSize));
	}

	const fields: TableFieldProps<ICity>[] = [
		{
			id: 'stateId',
			type: TableDataTypes.normal,
			label: t('STATE'),
			valueGetter: (row) => localeString(row.state?.name),
			link: true,
			linkGetter: (row) => `/state/${row.state?.id}`,
			flex: 0.8,
			minWidth: 80
		},
		{
			id: 'name',
			type: TableDataTypes.normal,
			label: t('NAME'),
			locale: true,
			flex: 0.6,
			minWidth: 60
		},
		{
			id: 'active',
			type: TableDataTypes.bool,
			label: t('STATUS'),
			flex: 0.5,
			minWidth: 50
		},
		{
			id: 'createdAt',
			type: TableDataTypes.date,
			label: t('CREATED_AT'),
			flex: 0.8,
			minWidth: 80
		},
		{
			id: 'actions',
			label: t('ACTIONS'),
			type: TableDataTypes.actions,
			actions: [
				{
					title: t('REMOVE'),
					color: 'error',
					onActionClick: openRemoveCityDialog,
					loadingGetter: (row) => row.id === loadingRemoveItem
				},
				{
					title: t('VIEW'),
					color: 'secondary',
					link: true,
					linkGetter: (row) => `/cities/${row.id}`
				},
				{
					title: t('ACTIVATE'),
					color: 'success',
					onActionClick: activateCity,
					loadingGetter: (row) => row.id === loadingActivateItem,
					conditions: [{ id: 'active', equalsTo: false }]
				},
				{
					title: t('DEACTIVATE'),
					color: 'error',
					onActionClick: deactivateCity,
					loadingGetter: (row) => row.id === loadingDeactivateItem,
					conditions: [{ id: 'active', equalsTo: true }]
				}
			]
		}
	];

	function openRemoveCityDialog(city: ICity) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_CITY_TITLE')}
						message={t('REMOVE_CITY_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(city.id);
							removeCity(city.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('CITY_REMOVED_SUCCESSFULLY'),
											variant: 'success',
											autoHideDuration: 2000,
											anchorOrigin: {
												vertical: 'top',
												horizontal: 'right'
											}
										})
									);
									refetch();
								})
								.catch((e) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_CITY'),
											variant: 'error',
											autoHideDuration: 2000,
											anchorOrigin: {
												vertical: 'top',
												horizontal: 'right'
											}
										})
									);
								});
						}}
					/>
				)
			})
		);
	}

	function activateCity(city: ICity) {
		setLoadingActivateItem(city.id);
		updateCity({ id: city.id, active: true })
			.unwrap()
			.then((action) => {
				setLoadingActivateItem(null);
				dispatch(
					showMessage({
						message: t('CITY_ACTIVATED_SUCCESSFULLY'),
						variant: 'success',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
				refetch();
			})
			.catch((e) => {
				setLoadingActivateItem(null);
				dispatch(
					showMessage({
						message: t('SOMETHING_WENT_WRONG_WHEN_ACTIVATE_CITY'),
						variant: 'error',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
	}

	function deactivateCity(city: ICity) {
		setLoadingDeactivateItem(city.id);
		updateCity({ id: city.id, active: false })
			.unwrap()
			.then((action) => {
				setLoadingDeactivateItem(null);
				dispatch(
					showMessage({
						message: t('CITY_DEACTIVATED_SUCCESSFULLY'),
						variant: 'success',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
				refetch();
			})
			.catch((e) => {
				setLoadingDeactivateItem(null);
				dispatch(
					showMessage({
						message: t('SOMETHING_WENT_WRONG_WHEN_DEACTIVATE_CITY'),
						variant: 'error',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
	}

	return (
		<div className="w-full flex flex-col h-full">
			<CustomTable
				fields={fields}
				status={isLoading || isFetching ? FetchStatus.loading : FetchStatus.done}
				data={cities?.results || []}
				total={cities?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default CitiesTable;
