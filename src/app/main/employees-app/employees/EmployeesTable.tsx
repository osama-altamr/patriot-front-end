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
import { Box, Chip } from '@mui/material';
import FuseUtils from '@fuse/utils';
import {
	toEmployeeAccessTypeTitle,
	toEmployeeAccessTypeColor,
	toEmployeeScopesTitle,
	employeeScopes
} from '../Utils';
import IEmployee from '../models/IEmployee';
import {
	newEmployeesInstance,
	resetEmployees,
	selectEmployeesDateFromFilter,
	selectEmployeesDateToFilter,
	selectEmployeesPage,
	selectEmployeesPageSize,
	selectEmployeesSearchText,
	setEmployeesPage,
	setEmployeesPageSize,
	selectEmployeesUserIdFilter,
	selectEmployeesStageIdFilter,
	selectEmployeesAccessTypeFilter
} from '../store/employeesSlice';
import { useGetEmployeesQuery, useRemoveEmployeeMutation, useUpdateEmployeeMutation } from '../EmployeesApi';

function EmployeesTable() {
	const { t } = useTranslation('employeesApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

	const page: number = useSelector(selectEmployeesPage);
	const pageSize: number = useSelector(selectEmployeesPageSize);
	const searchText: string | null = useSelector(selectEmployeesSearchText);

	const userIdFilter: string | null = useSelector(selectEmployeesUserIdFilter);
	const stageIdFilter: string | null = useSelector(selectEmployeesStageIdFilter);
	const accessTypeFilter: string | null = useSelector(selectEmployeesAccessTypeFilter);
	const dateFromFilter: string | null = useSelector(selectEmployeesDateFromFilter);
	const dateToFilter: string | null = useSelector(selectEmployeesDateToFilter);

	const {
		data: employees,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetEmployeesQuery(
		{
			page,
			pageSize,
			searchText,
			userIdFilter,
			stageIdFilter,
			accessTypeFilter,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeEmployee] = useRemoveEmployeeMutation();
	const [updateEmployee] = useUpdateEmployeeMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newEmployeesInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetEmployees(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setEmployeesPage(page));
		dispatch(setEmployeesPageSize(pageSize));
	}

	const tableActions: ActionProps<IEmployee>[] = [];

	if (FuseUtils.hasOperationPermission(employeeScopes.permissions, 'delete', user)) {
		tableActions.push({
			title: t('REMOVE'),
			color: 'error',
			onActionClick: openRemoveEmployeeDialog,
			loadingGetter: (row) => row.id === loadingRemoveItem
		});
	}

	tableActions.push({
		title: t('VIEW'),
		color: 'secondary',
		link: true,
		linkGetter: (row) => `/employees/${row.id}`
	});

	const fields: TableFieldProps<IEmployee>[] = [
		{
			id: 'userId',
			type: TableDataTypes.normal,
			label: t('USER'),
			valueGetter: (row) => row.user?.name,
			link: true,
			linkGetter: (row) => `/user/${row.user?.id}`
		},
		{
			id: 'stageId',
			type: TableDataTypes.normal,
			label: t('STAGE'),
			valueGetter: (row) => localeString(row.stage?.name),
			link: true,
			linkGetter: (row) => `/stage/${row.stage?.id}`
		},
		{
			id: 'accessType',
			type: TableDataTypes.normal,
			label: t('ACCESS_TYPE'),
			chip: true,
			toChipTitle: (value) => t(toEmployeeAccessTypeTitle(value)),
			toChipColor: toEmployeeAccessTypeColor
		},
		{
			id: 'scopes',
			type: TableDataTypes.normal,
			label: t('SCOPES'),
			valueGetter: (row) => {
				if (!row.scopes || row.scopes.length === 0) {
					return '—';
				}

				return (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
						{row.scopes.map((scope) => (
							<Chip
								key={scope.feature}
								label={t(toEmployeeScopesTitle(scope.feature))}
								size="small"
							/>
						))}
					</Box>
				);
			}
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

	function openRemoveEmployeeDialog(employee: IEmployee) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_EMPLOYEE_TITLE')}
						message={t('REMOVE_EMPLOYEE_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(employee.id);
							removeEmployee(employee.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('EMPLOYEE_REMOVED_SUCCESSFULLY'),
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
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_EMPLOYEE'),
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
				data={employees?.results || []}
				total={employees?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default EmployeesTable;