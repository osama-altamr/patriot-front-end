import { lazy } from 'react';
import i18next from 'i18next';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'homeApp', en);
i18next.addResourceBundle('ar', 'homeApp', ar);
const Home = lazy(() => import('./home/Home'));
/**
 * The analytics dashboard app config.
 */
const HomeAppConfig = {
	settings: {},
	routes: [
		{
			path: '/',
			element: <Home />
		}
	]
};

export default HomeAppConfig;
