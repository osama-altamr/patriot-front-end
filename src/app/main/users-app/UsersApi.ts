import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
import UserModel, { userEditableFields } from './models/UserModel';
import IUser from './models/IUser';

export const addTagTypes = ['Users', 'User', 'Home'] as const;

export type GetHomeApiResponse = {
	totals: {
		users: number;
		products: number;
		categories: number;
		materials: number;
		complaints: number;
		orders: number;
		reports: number;
		stages: number;
	};
};
export type GetHomeApiArg = { month: number };

const UserApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getHome: build.query<GetHomeApiResponse, GetHomeApiArg>({
				query: ({ totals }) => ({
					url: `v1/home/statistics`
				}),
				providesTags: ['Home']
			}),
			getDrivers: build.query<GetUsersApiResponse, GetUsersApiArg>({
				query: () => {
					const url = `v1/permissions/drivers`;
					return { url };
				},
				providesTags: ['Users']
			}),

			getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
				query: (filters) => {
					let url = `v1/users?page=${filters.page}&limit=${filters.pageSize}`;
					console.log(url)
					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.roleFilter !== 'all') {
						url += `&role=${filters.roleFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Users']
			}),
			removeUser: build.mutation<RemoveUserApiResponse, RemoveUserApiArg>({
				query: (userId) => ({
					url: `v1/users/${userId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['Users', 'User']
			}),
			getUser: build.query<GetUserApiResponse, GetUserApiArg>({
				query: (userId) => ({
					url: `v1/users/${userId}`
				}),
				providesTags: ['Users', 'User']
			}),
			updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>({
				query: (user) => ({
					url: `v1/users/${user.id}`,
					method: 'PATCH',
					data: _.pick(user, ...userEditableFields)
				}),
				invalidatesTags: ['Users', 'User']
			}),
			createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
				query: (newUser) => ({
					url: `v1/users`,
					method: 'POST',
					data: UserModel(newUser)
				}),
				invalidatesTags: ['Users', 'User']
			}),
		}),
		overrideExisting: false
	});

export default UserApi;
export type CreateUserApiResponse = /** status 200 OK */ IUser;
export type CreateUserApiArg = PartialDeep<IUser>;

export type GetUsersApiResponse = /** status 200 OK */ {
	results: IUser[];
	total: number;
};
export type GetUsersApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;

	roleFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveUserApiResponse = unknown;
export type RemoveUserApiArg = string; /** User ids */

export type GetUserApiResponse = /** status 200 OK */ IUser;
export type GetUserApiArg = string;

export type UpdateUserApiResponse = unknown;
export type UpdateUserApiArg = IUser; // Users

export const {
	useGetUsersQuery,
	useCreateUserMutation,
	useRemoveUserMutation,
	useGetUserQuery,
	useUpdateUserMutation,
	useGetHomeQuery,
	useGetDriversQuery,
} = UserApi;

export type UserApiType = {
	[UserApi.reducerPath]: ReturnType<typeof UserApi.reducer>;
};
