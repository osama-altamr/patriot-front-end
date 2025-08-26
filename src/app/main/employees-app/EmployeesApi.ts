import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
import EmployeeModel, { employeeEditableFields } from './models/EmployeeModel';
import IEmployee from './models/IEmployee';

export const addTagTypes = ['Employees', 'Employee'] as const;

const EmployeeApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getEmployees: build.query<GetEmployeesApiResponse, GetEmployeesApiArg>({
				query: (filters) => {
					let url = `v1/permissions?page=${filters.page}&limit=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.userIdFilter) {
						url += `&userId=${filters.userIdFilter}`;
					}

					if (filters.stageIdFilter) {
						url += `&stageId=${filters.stageIdFilter}`;
					}

					if (filters.accessTypeFilter !== 'all') {
						url += `&accessType=${filters.accessTypeFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Employees']
			}),
			removeEmployee: build.mutation<RemoveEmployeeApiResponse, RemoveEmployeeApiArg>({
				query: (employeeId) => ({
					url: `v1/permissions/${employeeId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['Employees', 'Employee']
			}),
			getEmployee: build.query<GetEmployeeApiResponse, GetEmployeeApiArg>({
				query: (employeeId) => ({
					url: `v1/permissions/${employeeId}`
				}),
				providesTags: ['Employees', 'Employee']
			}),
			updateEmployee: build.mutation<UpdateEmployeeApiResponse, UpdateEmployeeApiArg>({
				query: (employee) => ({
					url: `v1/permissions/${employee.id}`,
					method: 'PATCH',
					data: _.pick(employee, ...employeeEditableFields)
				}),
				invalidatesTags: ['Employees', 'Employee']
			}),
			createEmployee: build.mutation<CreateEmployeeApiResponse, CreateEmployeeApiArg>({
				query: (newEmployee) => ({
					url: `v1/permissions`,
					method: 'POST',
					data: EmployeeModel(newEmployee)
				}),
				invalidatesTags: ['Employees', 'Employee']
			})
		}),
		overrideExisting: false
	});

export default EmployeeApi;
export type CreateEmployeeApiResponse = /** status 200 OK */ IEmployee;
export type CreateEmployeeApiArg = PartialDeep<IEmployee>;

export type GetEmployeesApiResponse = /** status 200 OK */ {
	results: IEmployee[];
	total: number;
};
export type GetEmployeesApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;
	userIdFilter?: string;
	stageIdFilter?: string;
	accessTypeFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveEmployeeApiResponse = unknown;
export type RemoveEmployeeApiArg = string; /** Employee ids */

export type GetEmployeeApiResponse = /** status 200 OK */ IEmployee;
export type GetEmployeeApiArg = string;

export type UpdateEmployeeApiResponse = unknown;
export type UpdateEmployeeApiArg = IEmployee; // Employees

export const {
	useGetEmployeesQuery,
	useCreateEmployeeMutation,
	useRemoveEmployeeMutation,
	useGetEmployeeQuery,
	useUpdateEmployeeMutation
} = EmployeeApi;

export type EmployeeApiType = {
	[EmployeeApi.reducerPath]: ReturnType<typeof EmployeeApi.reducer>;
};
