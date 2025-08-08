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
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import IComplaint from '../models/IComplaint';
import {
	newComplaintsInstance,
	resetComplaints,
	selectComplaintsDateFromFilter,
	selectComplaintsDateToFilter,
	selectComplaintsPage,
	selectComplaintsPageSize,
	selectComplaintsSearchText,
	setComplaintsPage,
	setComplaintsPageSize,
	selectComplaintsTypeFilter,
	selectComplaintsStatusFilter,
	selectComplaintsUserIdFilter,
	selectComplaintsClosedByIdFilter
} from '../store/complaintsSlice';
import { useGetComplaintsQuery, useRemoveComplaintMutation, useUpdateComplaintMutation } from '../ComplaintsApi';
import { toComplaintTypeTitle, toComplaintTypeColor, toComplaintStatusTitle, toComplaintStatusColor } from '../Utils';

function ComplaintsTable() {
	const { t } = useTranslation('complaintsApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const [ready, setReady] = useState(false);
	const [loadingRemoveItem, setLoadingRemoveItem] = useState(null);

	const page: number = useSelector(selectComplaintsPage);
	const pageSize: number = useSelector(selectComplaintsPageSize);
	const searchText: string | null = useSelector(selectComplaintsSearchText);

	const typeFilter: string | null = useSelector(selectComplaintsTypeFilter);
	const statusFilter: string | null = useSelector(selectComplaintsStatusFilter);
	const userIdFilter: string | null = useSelector(selectComplaintsUserIdFilter);
	const closedByIdFilter: string | null = useSelector(selectComplaintsClosedByIdFilter);
	const dateFromFilter: string | null = useSelector(selectComplaintsDateFromFilter);
	const dateToFilter: string | null = useSelector(selectComplaintsDateToFilter);

	const {
		data: complaints,
		isLoading,
		isFetching,
		error,
		refetch
	} = useGetComplaintsQuery(
		{
			page,
			pageSize,
			searchText,

			typeFilter,
			statusFilter,
			userIdFilter,
			closedByIdFilter,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeComplaint] = useRemoveComplaintMutation();
	const [updateComplaint] = useUpdateComplaintMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newComplaintsInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetComplaints(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setComplaintsPage(page));
		dispatch(setComplaintsPageSize(pageSize));
	}

	const fields: TableFieldProps<IComplaint>[] = [
		{
			id: 'description',
			type: TableDataTypes.normal,
			label: t('DESCRIPTION')
		},
		{
			id: 'fileUrl',
			type: TableDataTypes.normal,
			label: t('FILE_URL')
		},
		{
			id: 'location',
			type: TableDataTypes.normal,
			label: t('LOCATION')
		},
		{
			id: 'type',
			type: TableDataTypes.normal,
			label: t('TYPE'),
			chip: true,
			toChipTitle: (value) => t(toComplaintTypeTitle(value)),
			toChipColor: toComplaintTypeColor
		},
		{
			id: 'status',
			type: TableDataTypes.normal,
			label: t('STATUS'),
			chip: true,
			toChipTitle: (value) => t(toComplaintStatusTitle(value)),
			toChipColor: toComplaintStatusColor
		},
		{
			id: 'userId',
			type: TableDataTypes.normal,
			label: t('USER'),
			valueGetter: (row) => row.user?.name,
			link: true,
			linkGetter: (row) => `/user/${row.user?.id}`
		},
		{
			id: 'closedById',
			type: TableDataTypes.normal,
			label: t('CLOSED_BY'),
			valueGetter: (row) => row.closedBy?.name,
			link: true,
			linkGetter: (row) => `/closed-by/${row.closedBy?.id}`
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
					onActionClick: openRemoveComplaintDialog,
					loadingGetter: (row) => row.id === loadingRemoveItem
				},
				{
					title: t('VIEW'),
					color: 'secondary',
					link: true,
					linkGetter: (row) => `/complaints/${row.id}`
				}
			]
		}
	];

	function openRemoveComplaintDialog(complaint: IComplaint) {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_COMPLAINT_TITLE')}
						message={t('REMOVE_COMPLAINT_MESSAGE')}
						onSubmit={() => {
							setLoadingRemoveItem(complaint.id);
							removeComplaint(complaint.id)
								.unwrap()
								.then((action) => {
									setLoadingRemoveItem(null);
									dispatch(
										showMessage({
											message: t('COMPLAINT_REMOVED_SUCCESSFULLY'),
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
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_COMPLAINT'),
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
				data={complaints?.results || []}
				total={complaints?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default ComplaintsTable;
