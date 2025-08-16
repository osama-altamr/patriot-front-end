import i18next from 'i18next';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig: FuseNavItemType[] = [
{
    id: "operation.all",
    title: "Operations",
    type: "item",
    customIcon: true,
    icon: "fa6-FaDiceD6",
    url: "/operations",
    translate: "OPERATIONS",
    end: true,
  },
	{
		id: 'dashboard',
		title: 'Dashboard',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaGaugeHigh',
		url: '/',
		translate: 'DASHBOARD'
	},
	{
		id: 'user.all',
		title: 'All Users',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaUsers',
		url: '/users',
		translate: 'ALL_USERS',
		end: true
	},
	{
		id: 'employee.all',
		title: 'Employees',
		type: 'item',
		customIcon: true,
		url: '/employees',
		icon: 'fa6-FaUsers',
		translate: 'EMPLOYEES',
		end: true
	},
	{
		id: 'complaint.all',
		title: 'Complaints',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaBullhorn',
		url: '/complaints',
		translate: 'COMPLAINTS',
		end: true
	},
	{
		id: 'stage.all',
		title: 'Factor Stages',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaStairs',
		url: '/stages',
		translate: 'FACTOR_STAGES',
		end: true
	},
	{
		id: 'material.all',
		title: 'Materials',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaLayerGroup',
		url: '/materials',
		translate: 'MATERIALS',
		end: true
	},
	{
		id: 'category.all',
		title: 'Categories',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaSitemap',
		url: '/categories',
		translate: 'CATEGORIES',
		end: true
	},
	{
		id: 'product.all',
		title: 'Products',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaBoxOpen',
		url: '/products',
		translate: 'PRODUCTS',
		end: true
	},
	{
		id: 'order.all',
		title: 'Orders',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaClipboardList',
		url: '/orders',
		translate: 'ORDERS',
		end: true
	},
	{
		id: 'report.all',
		title: 'Reports',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaChartPie',
		url: '/reports',
		translate: 'REPORTS',
		end: true
	},

	// {
	//   id: "customer.create",
	//   title: "Create New Customer",
	//   type: "item",
	//   customIcon: true,
	//   icon: "fa6-FaPlus",
	//   url: "y/new",
	//   translate: "CREATE_NEW_CUSTOMER",
	//   end: true,
	// },
	// {
	//     id: "category.create",
	//     title: "Create New Category",
	//     type: "item",
	//     customIcon: true,
	//     icon: "fa6-FaPlus",
	//     url: "/categories/new",
	//     translate: "CREATE_NEW_CATEGORY",
	//     end: true,
	//   },

	// {
	//     id: "product.create",
	//     title: "Create New Product",
	//     type: "item",
	//     customIcon: true,
	//     icon: "fa6-FaPlus",
	//     url: "/products/new",
	//     translate: "CREATE_NEW_PRODUCT",
	//     end: true,
	//   },
	{
		id: 'state.all',
		title: 'States',
		type: 'item',
		customIcon: true,
		url: '/states',
		icon: 'fa6-FaSitemap',
		translate: 'STATES',
		end: true
	},
	{
		id: 'city.all',
		title: 'Cities',
		type: 'item',
		customIcon: true,
		icon: 'fa6-FaSitemap',
		url: '/cities',
		translate: 'CITIES',
		end: true
	}
];
export default navigationConfig;
