export const employeeAccessType = {
	owner: 'owner',
	admin: 'admin',
	employee: 'employee',
	driver: 'driver'
};

export const employeeScopes = {
	products: 'products',
	categories: 'categories',
	orders: 'orders',
	complaints: 'complaints',
	materials: 'materials',
	permissions: 'permissions',
	stages: 'stages',
	reports: 'reports',
	users: 'users',
	states: 'states',
	cities: 'cities',
	operations: 'operations'
};

// --- Helper for Titles ---
export const toEmployeeAccessTypeTitle = (accessType) => {
	switch (accessType) {
		case employeeAccessType.owner:
			return 'OWNER';
		case employeeAccessType.admin:
			return 'ADMIN';
		case employeeAccessType.employee:
			return 'EMPLOYEE';
		case employeeAccessType.driver:
			return 'DRIVER';
		default:
			return accessType.toUpperCase();
	}
};

export const toEmployeeScopesTitle = (scope) => {
	switch (scope) {
		case employeeScopes.products:
			return 'PRODUCTS';
		case employeeScopes.categories:
			return 'CATEGORIES';
		case employeeScopes.orders:
			return 'ORDERS';
		case employeeScopes.complaints:
			return 'COMPLAINTS';
		case employeeScopes.materials:
			return 'MATERIALS';
		case employeeScopes.permissions:
			return 'EMPLOYEES';
		case employeeScopes.stages:
			return 'STAGES';
		case employeeScopes.reports:
			return 'REPORTS';
		case employeeScopes.users:
			return 'USERS';
		case employeeScopes.states:
			return 'STATES';
		case employeeScopes.cities:
			return 'CITIES';
		case employeeScopes.operations:
			return 'OPERATIONS';
		default:
			return scope.toUpperCase();
	}
};

// --- NEW: Helper for Icons ---
export const toEmployeeScopeIcon = (scope) => {
	switch (scope) {
		case employeeScopes.products:
			return 'fa-shirt';
		case employeeScopes.categories:
			return 'fa-shapes';
		case employeeScopes.orders:
			return 'fa-file-invoice-dollar';
		case employeeScopes.complaints:
			return 'fa-comment-dots';
		case employeeScopes.materials:
			return 'fa-layer-group';
		case employeeScopes.permissions:
			return 'fa-user-shield';
		case employeeScopes.stages:
			return 'fa-list-check';
		case employeeScopes.reports:
			return 'fa-chart-pie';
		case employeeScopes.users:
			return 'fa-users';
		case employeeScopes.states:
			return 'fa-map-location-dot';
		case employeeScopes.cities:
			return 'fa-city';
		case employeeScopes.operations:
			return 'fa-city';
		default:
			return 'fa-check'; // Default icon
	}
};

// --- Color Helpers (can be expanded later) ---
export const toEmployeeAccessTypeColor = (accessType) => {
	switch (accessType) {
		case employeeAccessType.owner:
			return 'bg-red-500';
		case employeeAccessType.admin:
			return 'bg-purple-500';
		case employeeAccessType.employee:
			return 'bg-blue-500';
		case employeeAccessType.driver:
			return 'bg-green-500';
		default:
			return 'bg-gray-500';
	}
};

export const toEmployeeScopesColor = (scopes) => {
	// This can be more detailed if needed
	return 'bg-blue-500';
};
