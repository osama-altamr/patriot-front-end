import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import _ from '@lodash';
import { Doughnut } from 'react-chartjs-2';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import Icon from 'app/shared-components/Icon';
import IReport, { IReportOrder } from '../../models/IReport';

// Define props for the component
type OrderAnalyticsProps = {
	form: IReport;
	doughnutOptions: object;
	t: (key: string) => string; // Translation function
};

function OrderAnalytics({ form, doughnutOptions, t }: OrderAnalyticsProps) {
	const theme = useTheme();

	// Color logic specific to order status
	const getOrderStatusChartColor = (status: string) => {
		switch (status) {
			case 'completed':
			case 'delivered':
				return theme.palette.success.main;
			case 'pending':
				return theme.palette.warning.main;
			case 'out-for-delivery':
				return theme.palette.info.main;
			case 'cancelled':
			case 'returned':
				return theme.palette.error.main;
			default:
				return theme.palette.grey[500];
		}
	};

	// Chart data configuration
	const orderDoughnutData = {
		labels: form.orderBreakdownByStatus?.map((item) => _.startCase(item.status)) || [],
		datasets: [
			{
				label: t('Number of Orders'),
				data: form.orderBreakdownByStatus?.map((item) => item.count) || [],
				backgroundColor:
					form.orderBreakdownByStatus?.map((item) => getOrderStatusChartColor(item.status)) || [],
				borderColor: theme.palette.background.paper,
				borderWidth: 2
			}
		]
	};

	// Table fields configuration
	const orderTableFields: TableFieldProps<IReportOrder>[] = [
		{ id: 'ref', type: TableDataTypes.normal, label: t('ORDER_REF') },
		{ id: 'status', label: t('STATUS'), type: TableDataTypes.normal },
		{ id: 'createdAt', type: TableDataTypes.date, label: t('CREATED_AT') }
	];

	return (
		<Grid
			container
			spacing={3}
			sx={{ alignItems: 'flex-start' }}
		>
			<Grid item xs={12} md={6}>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('TOTAL_ORDERS')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.orderSummary?.totalOrders ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-primary-100 rounded-full">
							<Icon
								type="fa6"
								name="FaBoxesPacking"
								size="2em"
								className="text-primary-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} md={6}>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('TOTAL_REVENUE')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.orderSummary?.totalRevenue ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-secondary-100 rounded-full">
							<Icon
								type="fa6"
								name="FaSackDollar"
								size="2em"
								className="text-secondary-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} lg={4}>
				<Card className="flex flex-col">
					<CardHeader title={t('ORDER_BREAKDOWN_BY_STATUS')} />
					<CardContent className="flex-auto flex items-center justify-center">
						<div style={{ height: '300px', width: '100%' }}>
							<Doughnut
								options={doughnutOptions}
								data={orderDoughnutData}
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} lg={8}>
				<Card>
					<CardHeader title={t('ORDERS')} />
					<CustomTable
						getRowId={(row) => row.id}
						fields={orderTableFields}
						status={FetchStatus.done}
						data={form.orders || []}
						total={form.orders?.length || 0}
						disablePagination
					/>
				</Card>
			</Grid>
		</Grid>
	);
}

export default OrderAnalytics;