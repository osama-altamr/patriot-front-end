import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next'; // 1. IMPORT useTranslation
import { useMemo } from 'react'; // 2. IMPORT useMemo
import CustomTable from 'app/shared-components/custom-table/CustomTable';
import { TableDataTypes, TableFieldProps } from 'app/shared-components/custom-table/Utils';
import { FetchStatus } from 'src/app/main/utils/dataStatus';
import Icon from 'app/shared-components/Icon';
import IReport, {
	ISaleBreakdownByCategory,
	ISaleBreakdownByCity,
	ISaleBreakdownByProduct,
	ISaleBreakdownByState
} from '../../models/IReport';

type SaleAnalyticsProps = {
	form: IReport;
	t: (key: string) => string;
};

function SaleAnalytics({ form, t }: SaleAnalyticsProps) {
	const theme = useTheme();
	const { i18n } = useTranslation(); // 3. GET the i18n instance
	const currentLang = i18n.language; // Get current language ('en', 'ar', etc.)

	// Line chart options remain the same
	const lineChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
				labels: { color: theme.palette.text.primary }
			},
			title: {
				display: true,
				text: t('DAILY_SALES_TREND'),
				color: theme.palette.text.primary
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: { color: theme.palette.text.secondary },
				grid: { color: theme.palette.divider }
			},
			x: {
				ticks: { color: theme.palette.text.secondary },
				grid: { color: theme.palette.divider }
			}
		}
	};

	// Line chart data remains the same
	const lineChartData = {
		labels: form.saleDailyTrend?.map((item) => item.date) || [],
		datasets: [
			{
				label: t('Total Revenue'),
				data: form.saleDailyTrend?.map((item) => item.totalRevenue) || [],
				borderColor: theme.palette.primary.main,
				backgroundColor: theme.palette.primary.light,
				tension: 0.3
			},
			{
				label: t('Order Count'),
				data: form.saleDailyTrend?.map((item) => item.orderCount) || [],
				borderColor: theme.palette.secondary.main,
				backgroundColor: theme.palette.secondary.light,
				tension: 0.3
			}
		]
	};

	// --- 4. PRE-PROCESS (FLATTEN) THE DATA FOR EACH TABLE ---

	const flattenedProductData = useMemo(() => {
		return (form.saleBreakdownByProduct || []).map((item) => ({
			...item,
			productName: item.productName?.[currentLang] || item.productName?.en || ''
		}));
	}, [form.saleBreakdownByProduct, currentLang]);

	const flattenedCategoryData = useMemo(() => {
		return (form.saleBreakdownByCategory || []).map((item) => ({
			...item,
			categoryName: item.categoryName?.[currentLang] || item.categoryName?.en || ''
		}));
	}, [form.saleBreakdownByCategory, currentLang]);

	const flattenedStateData = useMemo(() => {
		return (form.salesBreakdownByState || []).map((item) => ({
			...item,
			stateName: item.stateName?.[currentLang] || item.stateName?.en || ''
		}));
	}, [form.salesBreakdownByState, currentLang]);

	const flattenedCityData = useMemo(() => {
		return (form.salesBreakdownByCity || []).map((item) => ({
			...item,
			cityName: item.cityName?.[currentLang] || item.cityName?.en || '',
			stateName: item.stateName?.[currentLang] || item.stateName?.en || ''
		}));
	}, [form.salesBreakdownByCity, currentLang]);

	const productTableFields: TableFieldProps<ISaleBreakdownByProduct>[] = [
		{ id: 'productName', type: TableDataTypes.normal, label: t('PRODUCT_NAME') },
		{ id: 'quantitySold', type: TableDataTypes.normal, label: t('QUANTITY_SOLD') },
		{ id: 'totalRevenue', type: TableDataTypes.normal, label: t('TOTAL_REVENUE') }
	];

	const categoryTableFields: TableFieldProps<ISaleBreakdownByCategory>[] = [
		{ id: 'categoryName', type: TableDataTypes.normal, label: t('CATEGORY_NAME') },
		{ id: 'quantitySold', type: TableDataTypes.normal, label: t('QUANTITY_SOLD') },
		{ id: 'totalRevenue', type: TableDataTypes.normal, label: t('TOTAL_REVENUE') }
	];

	const stateTableFields: TableFieldProps<ISaleBreakdownByState>[] = [
		{ id: 'stateName', type: TableDataTypes.normal, label: t('STATE_NAME') },
		{ id: 'orderCount', type: TableDataTypes.normal, label: t('ORDER_COUNT') },
		{ id: 'totalRevenue', type: TableDataTypes.normal, label: t('TOTAL_REVENUE') }
	];

	const cityTableFields: TableFieldProps<ISaleBreakdownByCity>[] = [
		{ id: 'cityName', type: TableDataTypes.normal, label: t('CITY_NAME') },
		{ id: 'stateName', type: TableDataTypes.normal, label: t('STATE_NAME') },
		{ id: 'orderCount', type: TableDataTypes.normal, label: t('ORDER_COUNT') },
		{ id: 'totalRevenue', type: TableDataTypes.normal, label: t('TOTAL_REVENUE') }
	];

	const getSafeRowId = (row: any, idField?: string) => {
		if (idField && row[idField]) return row[idField];
		if (row.id) return row.id;
		if (row.productName) return row.productName;
		if (row.categoryName) return row.categoryName;
		return Math.random().toString();
	};

	return (
		<Grid
			container
			spacing={3}
			sx={{ alignItems: 'flex-start' }}
		>
			{/* Summary Cards */}
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('TOTAL_REVENUE')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.saleSummary?.totalRevenue ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-primary-100 rounded-full">
							<Icon
								type="fa6"
								name="FaDollarSign"
								size="2em"
								className="text-primary-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('TOTAL_ORDERS')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.saleSummary?.totalOrders ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-secondary-100 rounded-full">
							<Icon
								type="fa6"
								name="FaShoppingCart"
								size="2em"
								className="text-secondary-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('ITEMS_SOLD')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.saleSummary?.totalItemsSold ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-info-100 rounded-full">
							<Icon
								type="fa6"
								name="FaTags"
								size="2em"
								className="text-info-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
			>
				<Card>
					<CardContent className="flex items-center justify-between">
						<div>
							<Typography color="text.secondary">{t('AVG_ORDER_VALUE')}</Typography>
							<Typography
								variant="h5"
								className="font-bold"
							>
								{form.saleSummary?.averageOrderValue ?? 'N/A'}
							</Typography>
						</div>
						<div className="p-12 bg-success-100 rounded-full">
							<Icon
								type="fa6"
								name="FaChartLine"
								size="2em"
								className="text-success-600"
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>

			{/* Daily Trend Chart */}
			<Grid
				item
				xs={12}
			>
				<Card>
					<CardContent>
						<div style={{ height: '400px' }}>
							<Line
								options={lineChartOptions}
								data={lineChartData}
							/>
						</div>
					</CardContent>
				</Card>
			</Grid>
			<Grid
				item
				xs={12}
				lg={6}
			>
				<Card>
					<CardHeader title={t('BREAKDOWN_BY_PRODUCT')} />
					<CustomTable
						getRowId={(row) => getSafeRowId(row, 'productId')}
						fields={productTableFields}
						status={FetchStatus.done}
						data={flattenedProductData}
						total={flattenedProductData.length}
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
					<CardHeader title={t('BREAKDOWN_BY_CATEGORY')} />
					<CustomTable
						getRowId={(row) => getSafeRowId(row, 'categoryId')}
						fields={categoryTableFields}
						status={FetchStatus.done}
						data={flattenedCategoryData}
						total={flattenedCategoryData.length}
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
					<CardHeader title={t('BREAKDOWN_BY_STATE')} />
					<CustomTable
						getRowId={(row) => getSafeRowId(row, 'stateId')}
						fields={stateTableFields}
						status={FetchStatus.done}
						data={flattenedStateData}
						total={flattenedStateData.length}
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
					<CardHeader title={t('BREAKDOWN_BY_CITY')} />
					<CustomTable
						getRowId={(row) => getSafeRowId(row, 'cityId')}
						fields={cityTableFields}
						status={FetchStatus.done}
						data={flattenedCityData}
						total={flattenedCityData.length}
						disablePagination
					/>
				</Card>
			</Grid>
		</Grid>
	);
}

export default SaleAnalytics;   