import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import IReport, { IReportDriver, IReportEmployee } from '../../models/IReport';

// Define the props that this component will accept
type EmployeeAnalyticsProps = {
	form: IReport;
	t: (key: string) => string;
};

/**
 * A dedicated component to display analytics for the 'employee' report type.
 */
function EmployeeAnalytics({ form, t }: EmployeeAnalyticsProps) {
	// Define the table columns for the Drivers table
	const driverTableFields: TableFieldProps<IReportDriver>[] = [
		{ id: 'name', type: TableDataTypes.normal, label: t('DRIVER_NAME') },
		{
			id: 'deliveredOrders',
			type: TableDataTypes.normal,
			label: t('DELIVERED_ORDERS')
		},
		{
			id: 'averageDeliveryTimeMinutes',
			type: TableDataTypes.normal,
			label: t('AVG_DELIVERY_TIME_MIN')
		}
	];

	// Define the table columns for the general Employees table
	const employeeTableFields: TableFieldProps<IReportEmployee>[] = [
		{ id: 'name', type: TableDataTypes.normal, label: t('EMPLOYEE_NAME') },
		{
			id: 'completedItems',
			type: TableDataTypes.normal,
			label: t('COMPLETED_ITEMS')
		},
		{
			id: 'averageTime',
			type: TableDataTypes.normal,
			label: t('AVG_TASK_TIME_MIN')
		}
	];

	return (
		<Grid
			container
			spacing={3}
			sx={{ alignItems: 'flex-start' }}
		>
			<Grid
				item
				xs={12}
				lg={6}
			>
				<Card>
					<CardHeader title={t('DRIVER_PERFORMANCE')} />
					<CustomTable
						// Provide a stable ID for each row
						getRowId={(row) => row.id || row.name}
						fields={driverTableFields}
						status={FetchStatus.done}
						// Use the data from the form prop
						data={form.employeeBreakdownByType?.drivers || []}
						total={form.employeeBreakdownByType?.drivers?.length || 0}
						disablePagination
					/>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				lg={6}
			>
				<Card>
					<CardHeader title={t('EMPLOYEE_PERFORMANCE')} />
					<CustomTable
						getRowId={(row) => row.id || row.name}
						fields={employeeTableFields}
						status={FetchStatus.done}
						data={form.employeeBreakdownByType?.employees || []}
						total={form.employeeBreakdownByType?.employees?.length || 0}
						disablePagination
					/>
				</Card>
			</Grid>
		</Grid>
	);
}

export default EmployeeAnalytics;