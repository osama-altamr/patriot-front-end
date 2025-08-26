import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import AlertDialog from 'app/shared-components/alert-dialog/AlertDialog';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { ActionProps, TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import FuseUtils from '@fuse/utils';
import { employeeScopes } from '../../employees-app/Utils';
import IReport from '../models/IReport';
import { toReportTypeColor, toReportTypeTitle } from '../Utils';
import { useGetReportsQuery, useRemoveReportMutation } from '../ReportsApi';
import {
	newReportsInstance,
	resetReports,
	selectReportsDateFromFilter,
	selectReportsDateToFilter,
	selectReportsPage,
	selectReportsPageSize,
	selectReportsSearchText,
	selectReportsTypeFilter,
	setReportsPage,
	setReportsPageSize
} from '../store/reportsSlice';

function ReportsTable() {
	const { t } = useTranslation('reportsApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

	const page: number = useSelector(selectReportsPage);
	const pageSize: number = useSelector(selectReportsPageSize);
	const searchText: string | null = useSelector(selectReportsSearchText);

	const typeFilter: string | null = useSelector(selectReportsTypeFilter);
	const dateFromFilter: string | null = useSelector(selectReportsDateFromFilter);
	const dateToFilter: string | null = useSelector(selectReportsDateToFilter);

	const {
		data: reports,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetReportsQuery(
		{
			page,
			pageSize,
			searchText,

			typeFilter,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeReport] = useRemoveReportMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newReportsInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetReports(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setReportsPage(page));
		dispatch(setReportsPageSize(pageSize));
	}

	const tableActions: ActionProps<IReport>[] = [];

	if (FuseUtils.hasOperationPermission(employeeScopes.reports, 'update', user)) {
		tableActions.push({
			title: t('REMOVE'),
			color: 'error',
			onActionClick: openRemoveReportDialog,
			loadingGetter: (row) => row.id === loadingRemoveItem
		});
	}

	tableActions.push({
		title: t('VIEW'),
		color: 'secondary',
		link: true,
		linkGetter: (row) => `/reports/${row.id}`
	});

	const fields: TableFieldProps<IReport>[] = [
		{
			id: 'name',
			type: TableDataTypes.normal,
			label: t('NAME'),
			locale: true
		},
		{
			id: 'type',
			type: TableDataTypes.normal,
			label: t('TYPE'),
			chip: true,
			toChipTitle: (value) => t(toReportTypeTitle(value)),
			toChipColor: toReportTypeColor
		},
		{
			id: 'startDate',
			type: TableDataTypes.date,
			label: t('START_DATE')
		},
		{
			id: 'endDate',
			type: TableDataTypes.date,
			label: t('END_DATE')
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

	function openRemoveReportDialog(report: IReport) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_REPORT_TITLE')}
						message={t('REMOVE_REPORT_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(report.id);
							removeReport(report.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('REPORT_REMOVED_SUCCESSFULLY'),
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
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_REPORT'),
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
				data={reports?.results || []}
				total={reports?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default ReportsTable;