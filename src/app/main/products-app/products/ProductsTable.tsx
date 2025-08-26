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
import localeString from 'src/app/main/utils/localeString';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import FuseUtils from '@fuse/utils';
import { employeeScopes } from '../../employees-app/Utils';
import IProduct from '../models/IProduct';
import {
	newProductsInstance,
	resetProducts,
	selectProductsDateFromFilter,
	selectProductsDateToFilter,
	selectProductsPage,
	selectProductsPageSize,
	selectProductsSearchText,
	setProductsPage,
	setProductsPageSize,
	selectProductsCategoryIdFilter
} from '../store/productsSlice';
import { useGetProductsQuery, useRemoveProductMutation } from '../ProductsApi';

function ProductsTable() {
	const { t } = useTranslation('productsApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

	const page: number = useSelector(selectProductsPage);
	const pageSize: number = useSelector(selectProductsPageSize);
	const searchText: string | null = useSelector(selectProductsSearchText);

	const categoryIdFilter: string | null = useSelector(selectProductsCategoryIdFilter);
	const dateFromFilter: string | null = useSelector(selectProductsDateFromFilter);
	const dateToFilter: string | null = useSelector(selectProductsDateToFilter);

	const {
		data: products,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetProductsQuery(
		{
			page,
			pageSize,
			searchText,
			categoryIdFilter,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeProduct] = useRemoveProductMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newProductsInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetProducts(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setProductsPage(page));
		dispatch(setProductsPageSize(pageSize));
	}

	const tableActions: ActionProps<IProduct>[] = [];

	if (FuseUtils.hasOperationPermission(employeeScopes.products, 'update', user)) {
		tableActions.push({
			title: t('REMOVE'),
			color: 'error',
			onActionClick: openRemoveProductDialog,
			loadingGetter: (row) => row.id === loadingRemoveItem
		});
	}

	tableActions.push({
		title: t('VIEW'),
		color: 'secondary',
		link: true,
		linkGetter: (row) => `/products/${row.id}`
	});

	const fields: TableFieldProps<IProduct>[] = [
		{
			id: 'name',
			type: TableDataTypes.normal,
			label: t('NAME'),
			locale: true
		},
		{
			id: 'description',
			type: TableDataTypes.normal,
			label: t('DESCRIPTION'),
			locale: true
		},
		{
			id: 'imageUrl',
			type: TableDataTypes.image,
			label: t('IMAGE_URL')
		},
		{
			id: 'height',
			type: TableDataTypes.normal,
			label: t('HEIGHT')
		},
		{
			id: 'width',
			type: TableDataTypes.normal,
			label: t('WIDTH')
		},
		{
			id: 'pricePerSquareMeter',
			type: TableDataTypes.normal,
			label: t('PRICE_PER_SQUARE_METER'),
			valueFormatter: (value) => (value ? `$${Number(value).toFixed(2)}` : 'N/A') // Example formatting
		},
		{
			id: 'categoryId',
			type: TableDataTypes.normal,
			label: t('CATEGORY'),
			valueGetter: (row) => localeString(row.category?.name),
			link: true,
			linkGetter: (row) => `/categories/${row.category?.id}`
		},
		{
			id: 'stageIds',
			type: TableDataTypes.normal,
			label: t('STAGES'),
			valueGetter: (row) => row.stages?.map((v) => localeString(v.name) ?? '').join(', ')
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
			actions: tableActions
		}
	];

	function openRemoveProductDialog(product: IProduct) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_PRODUCT_TITLE')}
						message={t('REMOVE_PRODUCT_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(product.id);
							removeProduct(product.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('PRODUCT_REMOVED_SUCCESSFULLY'),
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
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_PRODUCT'),
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
				data={products?.results || []}
				total={products?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default ProductsTable;