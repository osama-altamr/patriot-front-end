import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
	requiredStringValidation,
	localeStringValidation,
	requiredDateTimeValidation
} from 'src/app/main/utils/validations';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Icon from 'app/shared-components/Icon';
import BasicInfoTab from './tabs/BasicInfoTab';
import IReport, { IReportDriver, IReportEmployee, IReportOrder } from '../models/IReport';
import ReportModel, { reportDefaultValues } from '../models/ReportModel';
import { useGetReportQuery } from '../ReportsApi';
import ReportHeader from './ReportHeader';

ChartJS.register(ArcElement, Tooltip, Legend);

function Report() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('reportsApp');
	const theme = useTheme();

	const schema = z
		.object({
			name: localeStringValidation(),
			type: requiredStringValidation(),
			startDate: requiredDateTimeValidation(),
			endDate: requiredDateTimeValidation() // Always required
		})
		.superRefine((data, ctx) => {
			if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('END_DATE_MUST_BE_AFTER_START_DATE'),
					path: ['endDate']
				});
			}
		});

	const routeParams = useParams();
	const { reportId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	const {
		data: report,
		isLoading,
		isError
	} = useGetReportQuery(reportId, {
		skip: !reportId || reportId === 'new'
	});

	const methods = useForm<IReport>({
		mode: 'onChange',
		defaultValues: reportDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();
	const { type: reportType } = form;

	// Chart Options
	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: { color: theme.palette.text.primary }
			}
		},
		cutout: '70%'
	};

	// Order Analytics
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
	const orderTableFields: TableFieldProps<IReportOrder>[] = [
		{ id: 'ref', type: TableDataTypes.normal, label: t('ORDER_REF') },
		{
			id: 'status',
			label: t('STATUS'),
			type: TableDataTypes.normal,
		},
		{ id: 'createdAt', type: TableDataTypes.date, label: t('CREATED_AT') }
	];

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

	// Complaint Analytics
	const getComplaintStatusChartColor = (status: string) => {
		switch (status) {
			case 'resolved':
				return theme.palette.success.main;
			case 'pending':
				return theme.palette.warning.main;
			case 'in_progress':
				return theme.palette.info.main;
			default:
				return theme.palette.grey[500];
		}
	};
	const complaintStatusDoughnutData = {
		labels: form.complaintBreakdownByStatus?.map((item) => _.startCase(item.status)) || [],
		datasets: [
			{
				label: t('Number of Complaints'),
				data: form.complaintBreakdownByStatus?.map((item) => item.count) || [],
				backgroundColor:
					form.complaintBreakdownByStatus?.map((item) => getComplaintStatusChartColor(item.status)) || [],
				borderColor: theme.palette.background.paper,
				borderWidth: 2
			}
		]
	};
	const complaintTypeDoughnutData = {
		labels: form.complaintBreakdownByType?.map((item) => _.startCase(item.type || 'uncategorized')) || [],
		datasets: [
			{
				label: t('Number of Complaints'),
				data: form.complaintBreakdownByType?.map((item) => item.count) || [],
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.error.main,
					theme.palette.info.main,
					theme.palette.success.main,
					theme.palette.warning.main
				],
				borderColor: theme.palette.background.paper,
				borderWidth: 2
			}
		]
	};

	useEffect(() => {
		if (reportId === 'new') {
			reset(ReportModel({}));
		}
	}, [reportId, reset]);

	useEffect(() => {
		if (report) {
			reset({ ...report });
		}
	}, [report, reset]);

	if (isError && reportId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					{t(`NO_REPORT`)}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/reports"
					color="inherit"
				>
					{t(`GO_TO_REPORTS`)}
				</Button>
			</motion.div>
		);
	}

	if (
		isLoading ||
		_.isEmpty(form) ||
		(report && routeParams.reportId !== report.id && routeParams.reportId !== 'new')
	) {
		return <FuseLoading />;
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	const showAnalyticsTab =
		reportId !== 'new' && (reportType === 'order' || reportType === 'employee' || reportType === 'complaint');

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ReportHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label={t('BASIC_INFO')}
							/>
							{showAnalyticsTab && (
								<Tab
									className="h-64"
									label={t('ANALYTICS')}
								/>
							)}
						</Tabs>
						<div className="p-16 sm:p-24 max-w-full">
							<div className={tabValue !== 0 ? 'hidden' : 'max-w-4xl'}>
								<BasicInfoTab />
							</div>

							{/* Analytics Content */}
							{showAnalyticsTab && (
								<div className={tabValue !== 1 ? 'hidden' : ''}>
									{/* ORDER ANALYTICS */}
									{reportType === 'order' && (
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
															<Typography variant="h5" className="font-bold">{form.orderSummary?.totalOrders ?? 'N/A'}</Typography>
														</div>
														<div className="p-12 bg-primary-100 rounded-full">
															<Icon type="fa6" name="FaBoxesPacking" size="2em" className="text-primary-600"/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} md={6}>
												<Card>
													<CardContent className="flex items-center justify-between">
														<div>
															<Typography color="text.secondary">{t('TOTAL_REVENUE')}</Typography>
															<Typography variant="h5" className="font-bold">{form.orderSummary?.totalRevenue ?? 'N/A'}</Typography>
														</div>
														<div className="p-12 bg-secondary-100 rounded-full">
															<Icon type="fa6" name="FaSackDollar" size="2em" className="text-secondary-600"/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} lg={4}>
												<Card className="flex flex-col">
													<CardHeader title={t('ORDER_BREAKDOWN_BY_STATUS')} />
													<CardContent className="flex-auto flex items-center justify-center">
														<div style={{ height: '300px', width: '100%' }}>
															<Doughnut options={doughnutOptions} data={orderDoughnutData}/>
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
									)}

									{/* EMPLOYEE ANALYTICS */}
									{reportType === 'employee' && (
										<Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
											<Grid item xs={12} lg={6}>
												<Card>
													<CardHeader title={t('DRIVER_PERFORMANCE')} />
													<CustomTable
														getRowId={(row) => row.id || row.name}
														fields={driverTableFields}
														status={FetchStatus.done}
														data={form.employeeBreakdownByType?.drivers || []}
														total={form.employeeBreakdownByType?.drivers?.length || 0}
														disablePagination
													/>
												</Card>
											</Grid>
											<Grid item xs={12} lg={6}>
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
									)}

									{/* COMPLAINT ANALYTICS */}
									{reportType === 'complaint' && (
										<Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
											<Grid item xs={12} sm={6} md={4}>
												<Card>
													<CardContent className="flex items-center justify-between">
														<div>
															<Typography color="text.secondary">{t('TOTAL_COMPLAINTS')}</Typography>
															<Typography variant="h5" className="font-bold">{form.complaintSummary?.totalComplaints ?? 'N/A'}</Typography>
														</div>
														<div className="p-12 bg-error-100 rounded-full">
															<Icon type="fa6" name="FaExclamationCircle" size="2em" className="text-error-600"/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} sm={6} md={4}>
												<Card>
													<CardContent className="flex items-center justify-between">
														<div>
															<Typography color="text.secondary">{t('OPEN_COMPLAINTS')}</Typography>
															<Typography variant="h5" className="font-bold">{form.complaintSummary?.openComplaints ?? 'N/A'}</Typography>
														</div>
														<div className="p-12 bg-warning-100 rounded-full">
															<Icon type="fa6" name="FaSpinner" size="2em" className="text-warning-600"/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} sm={6} md={4}>
												<Card>
													<CardContent className="flex items-center justify-between">
														<div>
															<Typography color="text.secondary">{t('RESOLVED_COMPLAINTS')}</Typography>
															<Typography variant="h5" className="font-bold">{form.complaintSummary?.resolvedComplaints ?? 'N/A'}</Typography>
														</div>
														<div className="p-12 bg-success-100 rounded-full">
															<Icon type="fa6" name="FaCheckCircle" size="2em" className="text-success-600"/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} md={6}>
												<Card className="flex flex-col">
													<CardHeader title={t('COMPLAINT_BREAKDOWN_BY_STATUS')} />
													<CardContent className="flex-auto flex items-center justify-center">
														<div style={{ height: '300px', width: '100%' }}>
															<Doughnut options={doughnutOptions} data={complaintStatusDoughnutData}/>
														</div>
													</CardContent>
												</Card>
											</Grid>
											<Grid item xs={12} md={6}>
												<Card className="flex flex-col">
													<CardHeader title={t('COMPLAINT_BREAKDOWN_BY_TYPE')} />
													<CardContent className="flex-auto flex items-center justify-center">
														<div style={{ height: '300px', width: '100%' }}>
															<Doughnut options={doughnutOptions} data={complaintTypeDoughnutData}/>
														</div>
													</CardContent>
												</Card>
											</Grid>
										</Grid>
									)}
								</div>
							)}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Report;