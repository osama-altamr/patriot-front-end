import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import AlertDialog from 'app/shared-components/alert-dialog/AlertDialog';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { ActionProps, TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import ICategory from '../models/ICategory';
import {
	newCategoriesInstance,
	resetCategories,
	selectCategoriesDateFromFilter,
	selectCategoriesDateToFilter,
	selectCategoriesPage,
	selectCategoriesPageSize,
	selectCategoriesSearchText,
	setCategoriesPage,
	setCategoriesPageSize
} from '../store/categoriesSlice';
import { useGetCategoriesQuery, useRemoveCategoryMutation, useUpdateCategoryMutation } from '../CategoriesApi';
import FuseUtils from '@fuse/utils';
import { employeeScopes } from '../../employees-app/Utils';

function CategoriesTable() {
	const { t } = useTranslation('categoriesApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

	const page: number = useSelector(selectCategoriesPage);
	const pageSize: number = useSelector(selectCategoriesPageSize);
	const searchText: string | null = useSelector(selectCategoriesSearchText);

	const dateFromFilter: string | null = useSelector(selectCategoriesDateFromFilter);
	const dateToFilter: string | null = useSelector(selectCategoriesDateToFilter);

	const {
		data: categories,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetCategoriesQuery(
		{
			page,
			pageSize,
			searchText,

			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeCategory] = useRemoveCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newCategoriesInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetCategories(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setCategoriesPage(page));
		dispatch(setCategoriesPageSize(pageSize));
	}

	const tableActions: ActionProps<ICategory>[] = [];

	if (FuseUtils.hasOperationPermission(employeeScopes.categories, 'create', user)) {
		tableActions.push({
			title: t('REMOVE'),
			color: 'error',
			onActionClick: openRemoveCategoryDialog,
			loadingGetter: (row) => row.id === loadingRemoveItem
		});
	}

	tableActions.push({
		title: t('VIEW'),
		color: 'secondary',
		link: true,
		linkGetter: (row) => `/categories/${row.id}`
	});


	const fields: TableFieldProps<ICategory>[] = [
		{
			id: 'name',
			type: TableDataTypes.normal,
			label: t('NAME'),
			locale: true,
			flex: 0.4,
			minWidth: 40
		},
		{
			id: 'description',
			type: TableDataTypes.normal,
			label: t('DESCRIPTION'),
			locale: true,
			flex: 0.4,
			minWidth: 40
		},
		{
			id: 'imageUrl',
			type: TableDataTypes.image,
			label: t('IMAGE_URL')
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
			actions: tableActions,
		}
	];

	function openRemoveCategoryDialog(category: ICategory) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_CATEGORY_TITLE')}
						message={t('REMOVE_CATEGORY_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(category.id);
							removeCategory(category.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('CATEGORY_REMOVED_SUCCESSFULLY'),
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
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_CATEGORY'),
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

	return (
		<div className="w-full flex flex-col h-full">
			<CustomTable
				fields={fields}
				status={isLoading || isFetching ? FetchStatus.loading : FetchStatus.done}
				data={categories?.results || []}
				total={categories?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default CategoriesTable;
