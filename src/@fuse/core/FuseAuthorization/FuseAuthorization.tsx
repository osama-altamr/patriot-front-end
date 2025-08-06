import { Component, ReactNode } from 'react';
import { matchRoutes } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import AppContext, { AppContextType } from 'app/AppContext';
import withRouter from '@fuse/core/withRouter';
import history from '@history';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import {
	getSessionRedirectUrl,
	resetSessionRedirectUrl,
	setSessionRedirectUrl
} from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
import FuseLoading from '@fuse/core/FuseLoading';
import { User } from 'src/app/auth/user';

type FuseAuthorizationProps = {
	children: ReactNode;
	location: Location;
	user: User;
	loginRedirectUrl?: string;
} & WithRouterProps;

type State = AppContextType & {
	accessGranted: boolean;
	shouldRegisterProfile: boolean;
};

function isUserGuest(role: string[] | string) {
	return !role || (Array.isArray(role) && role?.length === 0);
}

/**
 * FuseAuthorization is a higher-order component that wraps its child component which handles the authorization logic of the app.
 * It checks the provided Auth property from FuseRouteItemType (auth property) against the current logged-in user role.
 */
class FuseAuthorization extends Component<FuseAuthorizationProps, State> {
	constructor(props: FuseAuthorizationProps, context: AppContextType) {
		super(props);

		const { routes } = context;

		this.state = {
			accessGranted: true,
			shouldRegisterProfile: false,
			routes
		};
	}

	componentDidMount() {
		const { accessGranted, shouldRegisterProfile } = this.state;

		if (!accessGranted || shouldRegisterProfile) {
			this.redirectRoute();
		}
	}

	shouldComponentUpdate(nextProps: FuseAuthorizationProps, nextState: State) {
		const { accessGranted, shouldRegisterProfile } = this.state;

		return nextState.accessGranted !== accessGranted || nextState.shouldRegisterProfile !== shouldRegisterProfile;
	}

	componentDidUpdate() {
		const { accessGranted, shouldRegisterProfile } = this.state;

		if (!accessGranted || shouldRegisterProfile) {
			this.redirectRoute();
		}
	}

	static getDerivedStateFromProps(props: FuseAuthorizationProps, state: State) {
		const { location, user } = props;
		const { pathname } = location;
		const matchedRoutes = matchRoutes(state.routes, pathname);
		const matched = matchedRoutes ? matchedRoutes[0] : false;

		if (!matched) {
			return { accessGranted: true };
		}

		const { route }: { route: FuseRouteItemType } = matched;
		const userRole = FuseUtils.getUserRole(user);
		const userHasPermission = FuseUtils.hasPermission(route.auth, userRole);
		const isGuest = isUserGuest(userRole);
		const shouldRegisterProfile = user && !user.name;

		const ignoredPaths = [
			'/',
			'/callback',
			'/sign-in',
			'/sign-out',
			'/delete-account',
			'/sign-in-using-email',
			'/logout',
			'/error/404'
		];

		if (matched && !userHasPermission && !ignoredPaths.includes(pathname)) {
			setSessionRedirectUrl(pathname);
		}

		/**
		 * If user is member but don't have permission to view the route
		 * redirected to main route '/'
		 */
		if (!userHasPermission && !isGuest && !ignoredPaths.includes(pathname)) {
			setSessionRedirectUrl('/');
		}

		return {
			accessGranted: matched ? userHasPermission : true,
			shouldRegisterProfile
		};
	}

	redirectRoute() {
		const { user, loginRedirectUrl = '/' } = this.props;
		const { shouldRegisterProfile } = this.state;
		const redirectUrl = getSessionRedirectUrl() || loginRedirectUrl;

		/*
		User is guest
		Redirect to Login Page
		*/
		if (!user) {
			setTimeout(() => history.push(`/sign-in`), 0);
		} else if (shouldRegisterProfile) {
			// user exist but not registered yet
			// refirect to Sign Up Page
			setTimeout(() => history.push('/register-profile'), 0);
		} else {
			/*
		  User is member
		  User must be on unAuthorized page or just logged in
		  Redirect to dashboard or loginRedirectUrl
			*/
			setTimeout(() => history.push(redirectUrl), 0);
			resetSessionRedirectUrl();
		}
	}

	render() {
		const { accessGranted } = this.state;
		const { children } = this.props;

		return accessGranted ? children : <FuseLoading />;
	}
}

FuseAuthorization.contextType = AppContext;

export default withRouter(FuseAuthorization);
