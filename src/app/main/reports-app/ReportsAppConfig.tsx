import { lazy } from 'react';
import i18next from 'i18next';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'reportsApp', en);
i18next.addResourceBundle('ar', 'reportsApp', ar);
const Reports = lazy(() => import('./reports/Reports'));
const Report = lazy(() => import('./report/Report'));

const ReportsAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'reports',
			element: <Reports />
		},
		{
			path: 'reports/:reportId',
			element: <Report />
		}
	]
};

export default ReportsAppConfig;
