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
	cities: 'cities'
};

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
	}
	return 'OWNER';
};
export const toEmployeeScopesTitle = (scopes) => {
	switch (scopes) {
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
	}
	return 'PRODUCTS';
};
export const toEmployeeAccessTypeColor = (accessType) => {
	switch (accessType) {
		case employeeAccessType.owner:
			return 'bg-blue-500';
		case employeeAccessType.admin:
			return 'bg-blue-500';
		case employeeAccessType.employee:
			return 'bg-blue-500';
		case employeeAccessType.driver:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
export const toEmployeeScopesColor = (scopes) => {
	switch (scopes) {
		case employeeScopes.products:
			return 'bg-blue-500';
		case employeeScopes.categories:
			return 'bg-blue-500';
		case employeeScopes.orders:
			return 'bg-blue-500';
		case employeeScopes.complaints:
			return 'bg-blue-500';
		case employeeScopes.materials:
			return 'bg-blue-500';
		case employeeScopes.permissions:
			return 'bg-blue-500';
		case employeeScopes.stages:
			return 'bg-blue-500';
		case employeeScopes.reports:
			return 'bg-blue-500';
		case employeeScopes.users:
			return 'bg-blue-500';
		case employeeScopes.states:
			return 'bg-blue-500';
		case employeeScopes.cities:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
