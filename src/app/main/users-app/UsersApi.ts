import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import UserModel, { userEditableFields } from "./models/UserModel";
import IUser from "./models/IUser";

export const addTagTypes = ["Users", "User"] as const;

const UserApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
        query: (filters) => {
          var url = `v1/users?page=${filters.page}&pageSize=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          
          if (filters.roleFilter !== "all") {
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
        providesTags: ["Users"],
      }),
      removeUser: build.mutation<RemoveUserApiResponse, RemoveUserApiArg>(
        {
          query: (userId) => ({
            url: `v1/users/${userId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Users", "User"],
        }
      ),
      getUser: build.query<GetUserApiResponse, GetUserApiArg>({
        query: (userId) => ({
          url: `v1/users/${userId}`,
        }),
        providesTags: ["Users", "User"],
      }),
      updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>(
        {
          query: (user) => ({
            url: `v1/users/${user.id}`,
            method: "PATCH",
            data: _.pick(user, ...userEditableFields),
          }),
          invalidatesTags: ["Users", "User"],
        }
      ),
      createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>(
        {
          query: (newUser) => ({
            url: `v1/users`,
            method: "POST",
            data: UserModel(newUser),
          }),
          invalidatesTags: ["Users", "User"],
        }
      ),
    }),
    overrideExisting: false,
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
  
  roleFilter?: string,
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
} = UserApi;

export type UserApiType = {
  [UserApi.reducerPath]: ReturnType<typeof UserApi.reducer>;
};