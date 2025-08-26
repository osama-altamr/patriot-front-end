import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import StateModel, { stateEditableFields } from "./models/StateModel";
import IState from "./models/IState";

export const addTagTypes = ["States", "State"] as const;

const StateApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStates: build.query<GetStatesApiResponse, GetStatesApiArg>({
        query: (filters) => {
          var url = `v1/states?page=${filters.page}&limit=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          if (filters.activeFilter !== "all") {
            // url += `&active=${filters.activeFilter}`;
          }
          
          if (filters.dateFromFilter) {
            url += `&dateFrom=${filters.dateFromFilter}`;
          }
          if (filters.dateToFilter) {
            url += `&dateTo=${filters.dateToFilter}`;
          }
          return { url };
        },
        providesTags: ["States"],
      }),
      removeState: build.mutation<RemoveStateApiResponse, RemoveStateApiArg>(
        {
          query: (stateId) => ({
            url: `v1/states/${stateId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["States", "State"],
        }
      ),
      getState: build.query<GetStateApiResponse, GetStateApiArg>({
        query: (stateId) => ({
          url: `v1/states/${stateId}`,
        }),
        providesTags: ["States", "State"],
      }),
      updateState: build.mutation<UpdateStateApiResponse, UpdateStateApiArg>(
        {
          query: (state) => ({
            url: `v1/states/${state.id}`,
            method: "PATCH",
            data: _.pick(state, ...stateEditableFields),
          }),
          invalidatesTags: ["States", "State"],
        }
      ),
      createState: build.mutation<CreateStateApiResponse, CreateStateApiArg>(
        {
          query: (newState) => ({
            url: `v1/states`,
            method: "POST",
            data: StateModel(newState),
          }),
          invalidatesTags: ["States", "State"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default StateApi;
export type CreateStateApiResponse = /** status 200 OK */ IState;
export type CreateStateApiArg = PartialDeep<IState>;

export type GetStatesApiResponse = /** status 200 OK */ {
  results: IState[];
  total: number;
};
export type GetStatesApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  activeFilter?: string;
  
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveStateApiResponse = unknown;
export type RemoveStateApiArg = string; /** State ids */

export type GetStateApiResponse = /** status 200 OK */ IState;
export type GetStateApiArg = string;

export type UpdateStateApiResponse = unknown;
export type UpdateStateApiArg = IState; // States

export const {
  useGetStatesQuery,
  useCreateStateMutation,
  useRemoveStateMutation,
  useGetStateQuery,
  useUpdateStateMutation,
} = StateApi;

export type StateApiType = {
  [StateApi.reducerPath]: ReturnType<typeof StateApi.reducer>;
};