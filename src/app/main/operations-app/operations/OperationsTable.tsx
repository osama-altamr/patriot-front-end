import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import localeString from 'src/app/main/utils/localeString';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import IOperation from '../models/IOperation';
import {
	newOperationsInstance,
	resetOperations,
	selectOperationsDateFromFilter,
	selectOperationsDateToFilter,
	selectOperationsPage,
	selectOperationsPageSize,
	selectOperationsSearchText,
	setOperationsPage,
	setOperationsPageSize,
	selectOperationsCurrentStageIdFilter
} from '../store/operationsSlice';
import { useGetOperationsQuery, useRemoveOperationMutation, useUpdateOperationMutation } from '../OperationsApi';
import { toOperationStatusTitle, toOperationStatusColor } from '../Utils';

function OperationsTable() {
	const { t } = useTranslation('operationsApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const myStageId = user.permissions.stage.id;
	const routeParams = useParams();
	const [ready, setReady] = useState(false);

	const page: number = useSelector(selectOperationsPage);
	const pageSize: number = useSelector(selectOperationsPageSize);
	const searchText: string | null = useSelector(selectOperationsSearchText);

	const currentStageIdFilter: string | null = useSelector(selectOperationsCurrentStageIdFilter);
	const dateFromFilter: string | null = useSelector(selectOperationsDateFromFilter);
	const dateToFilter: string | null = useSelector(selectOperationsDateToFilter);
	const {
		data: operations,
		isLoading,
		isFetching
	} = useGetOperationsQuery(
		{
			page,
			pageSize,
			searchText,
			currentStageIdFilter: myStageId,
			dateFromFilter,
			dateToFilter
		},
		{ skip: !ready, refetchOnMountOrArgChange: true }
	);
	const [removeOperation] = useRemoveOperationMutation();
	const [updateOperation] = useUpdateOperationMutation();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(newOperationsInstance({}));
		setReady(true);
	}, [dispatch, routeParams]);

	useEffect(() => {
		return () => {
			dispatch(resetOperations(null));
		};
	}, [dispatch]);

	function onChangePagination({ page, pageSize }) {
		dispatch(setOperationsPage(page));
		dispatch(setOperationsPageSize(pageSize));
	}

	const fields: TableFieldProps<IOperation>[] = [
		{
			id: 'width',
			type: TableDataTypes.normal,
			label: t('WIDTH')
		},
		{
			id: 'height',
			type: TableDataTypes.normal,
			label: t('HEIGHT')
		},
		{
			id: 'status',
			type: TableDataTypes.normal,
			label: t('STATUS'),
			chip: true,
			toChipTitle: (value) => t(toOperationStatusTitle(value)),
			toChipColor: toOperationStatusColor
		},
		{
			id: 'note',
			type: TableDataTypes.normal,
			label: t('NOTE')
		},
		{
			id: 'currentStageId',
			type: TableDataTypes.normal,
			label: t('CURRENT_STAGE'),
			valueGetter: (row) => localeString(row.currentStage?.name),
			link: true,
			linkGetter: (row) => `/current-stage/${row.currentStage?.id}`
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
			actions: [
				{
					title: t('VIEW'),
					color: 'secondary',
					link: true,
					linkGetter: (row) => `/operations/${row.id}`
				}
			]
		}
	];

	return (
		<div className="w-full flex flex-col h-full">
			<CustomTable
				fields={fields}
				status={isLoading || isFetching ? FetchStatus.loading : FetchStatus.done}
				data={operations?.results || []}
				total={operations?.total || 0}
				page={page}
				pageSize={pageSize}
				onChangePagination={onChangePagination}
				checkboxSelection
			/>
		</div>
	);
}

export default OperationsTable;
