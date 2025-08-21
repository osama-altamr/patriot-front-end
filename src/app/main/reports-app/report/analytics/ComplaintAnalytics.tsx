import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import _ from '@lodash';
import { Doughnut } from 'react-chartjs-2';
import Icon from 'app/shared-components/Icon';
import IReport from '../../models/IReport';

// Define props for the component
type ComplaintAnalyticsProps = {
	form: IReport;
	doughnutOptions: object;
	t: (key: string) => string;
};

function ComplaintAnalytics({ form, doughnutOptions, t }: ComplaintAnalyticsProps) {
	const theme = useTheme();

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
					form.complaintBreakdownByStatus?.map((item) => getComplaintStatusChartColor(item.status)) ||
					[],
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

	return (
		<Grid
			container
			spacing={3}
			sx={{ alignItems: 'flex-start' }}
		>
			<Grid
				item
				xs={12}
				sm={6}
				md={4}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('TOTAL_COMPLAINTS')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.complaintSummary?.totalComplaints ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-error-100 rounded-full">
							<Icon
								type="fa6"
								name="FaExclamationCircle"
								size="2em"
								className="text-error-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={4}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('OPEN_COMPLAINTS')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.complaintSummary?.openComplaints ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-warning-100 rounded-full">
							<Icon
								type="fa6"
								name="FaSpinner"
								size="2em"
								className="text-warning-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={4}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('RESOLVED_COMPLAINTS')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.complaintSummary?.resolvedComplaints ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-success-100 rounded-full">
							<Icon
								type="fa6"
								name="FaCheckCircle"
								size="2em"
								className="text-success-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<Card className="flex flex-col">
					<CardHeader title={t('COMPLAINT_BREAKDOWN_BY_STATUS')} />
					<CardContent className="flex-auto flex items-center justify-center">
						<div style={{ height: '300px', width: '100%' }}>
							<Doughnut
								options={doughnutOptions}
								data={complaintStatusDoughnutData}
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				md={6}
			>
				<Card className="flex flex-col">
					<CardHeader title={t('COMPLAINT_BREAKDOWN_BY_TYPE')} />
					<CardContent className="flex-auto flex items-center justify-center">
						<div style={{ height: '300px', width: '100%' }}>
							<Doughnut
								options={doughnutOptions}
								data={complaintTypeDoughnutData}
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default ComplaintAnalytics;