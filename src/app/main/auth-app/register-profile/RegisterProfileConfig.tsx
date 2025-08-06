import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import i18next from 'i18next';
import { authRoles } from 'src/app/auth';
import RegisterProfilePage from './RegisterProfilePage';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'registerProfile', en);
i18next.addResourceBundle('ar', 'registerProfile', ar);

const RegisterProfileConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: 'register-profile',
			element: <RegisterProfilePage />
		}
	]
};

export default RegisterProfileConfig;
