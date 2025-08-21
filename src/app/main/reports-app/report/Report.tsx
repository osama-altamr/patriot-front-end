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
import { Chart as ChartJS, ArcElement, Tooltip, Legend,
	CategoryScale, 
	LinearScale,  
	PointElement,
	LineElement,
	Title      

 } from 'chart.js';
import BasicInfoTab from './tabs/BasicInfoTab';
import IReport from '../models/IReport';
import ReportModel, { reportDefaultValues } from '../models/ReportModel';
import { useGetReportQuery } from '../ReportsApi';
import ReportHeader from './ReportHeader';

// Import the new analytics components
import OrderAnalytics from './analytics/OrderAnalytics';
import EmployeeAnalytics from './analytics/EmployeeAnalytics';
import ComplaintAnalytics from './analytics/ComplaintAnalytics';
import SaleAnalytics from './analytics/SaleAnalytics';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

function Report() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('reportsApp');
	const theme = useTheme();

	const schema = z
		.object({
			name: localeStringValidation(),
			type: requiredStringValidation(),
			startDate: requiredDateTimeValidation(),
			endDate: requiredDateTimeValidation()
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

	// Common Chart Options
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
    reportId !== 'new' && (reportType === 'order' || reportType === 'employee' || reportType === 'complaint' || reportType === 'sale');

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

							{showAnalyticsTab && (
								<div className={tabValue !== 1 ? 'hidden' : ''}>
									{reportType === 'order' && (
										<OrderAnalytics
											form={form}
											doughnutOptions={doughnutOptions}
											t={t}
										/>
									)}
									{reportType === 'employee' && (
										<EmployeeAnalytics
											form={form}
											t={t}
										/>
									)}
									{reportType === 'complaint' && (
										<ComplaintAnalytics
											form={form}
											doughnutOptions={doughnutOptions}
											t={t}
										/>
									)}
									 {reportType === 'sale' && (
										<SaleAnalytics
											form={form}
											t={t}
										/>
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