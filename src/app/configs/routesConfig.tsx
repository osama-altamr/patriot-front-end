import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import AuthAppConfigs from '../main/auth-app/AuthAppConfigs';
import CommonConfigs from '../main/common/CommonConfigs';
import StagesAppConfig from '../main/stages-app/StagesAppConfig';
import CategoriesAppConfig from '../main/categories-app/CategoriesAppConfig';
import MaterialsAppConfig from '../main/materials-app/MaterialsAppConfig';
import StatesAppConfig from '../main/states-app/StatesAppConfig';
import CitiesAppConfig from '../main/cities-app/CitiesAppConfig';
import EmployeesAppConfig from '../main/employees-app/EmployeesAppConfig';
import UsersAppConfig from '../main/users-app/UsersAppConfig';
import ComplaintsAppConfig from '../main/complaints-app/ComplaintsAppConfig';
import ReportsAppConfig from '../main/reports-app/ReportsAppConfig';
import HomeAppConfig from '../main/home-app/HomeAppConfig';
import ProductsAppConfig from '../main/products-app/ProductsAppConfig';
import OrdersAppConfig from "../main/orders-app/OrdersAppConfig";
import OperationsAppConfig from "../main/operations-app/OperationsAppConfig";

const routeConfigs: FuseRouteConfigsType = [
	OperationsAppConfig,
	OrdersAppConfig,
	ProductsAppConfig,
	HomeAppConfig,
	ReportsAppConfig,
	UsersAppConfig,
	ComplaintsAppConfig,
	EmployeesAppConfig,
	CitiesAppConfig,
	StatesAppConfig,
	MaterialsAppConfig,
	CategoriesAppConfig,
	StagesAppConfig,
	...CommonConfigs,
	...AuthAppConfigs
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '*',
		element: <Navigate to="error/404" />
	}
];

export default routes;
