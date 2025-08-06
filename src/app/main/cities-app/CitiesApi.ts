import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import CityModel, { cityEditableFields } from "./models/CityModel";
import ICity from "./models/ICity";

export const addTagTypes = ["Cities", "City"] as const;

const CityApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCities: build.query<GetCitiesApiResponse, GetCitiesApiArg>({
        query: (filters) => {
          var url = `v1/cities?page=${filters.page}&pageSize=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          if (filters.activeFilter !== "all") {
            url += `&active=${filters.activeFilter}`;
          }
          if (filters.stateIdFilter) {
      url += `&stateId=${filters.stateIdFilter}`;
    }
          if (filters.dateFromFilter) {
            url += `&dateFrom=${filters.dateFromFilter}`;
          }
          if (filters.dateToFilter) {
            url += `&dateTo=${filters.dateToFilter}`;
          }
          return { url };
        },
        providesTags: ["Cities"],
      }),
      removeCity: build.mutation<RemoveCityApiResponse, RemoveCityApiArg>(
        {
          query: (cityId) => ({
            url: `v1/cities/${cityId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Cities", "City"],
        }
      ),
      getCity: build.query<GetCityApiResponse, GetCityApiArg>({
        query: (cityId) => ({
          url: `v1/cities/${cityId}`,
        }),
        providesTags: ["Cities", "City"],
      }),
      updateCity: build.mutation<UpdateCityApiResponse, UpdateCityApiArg>(
        {
          query: (city) => ({
            url: `v1/cities/${city.id}`,
            method: "PATCH",
            data: _.pick(city, ...cityEditableFields),
          }),
          invalidatesTags: ["Cities", "City"],
        }
      ),
      createCity: build.mutation<CreateCityApiResponse, CreateCityApiArg>(
        {
          query: (newCity) => ({
            url: `v1/cities`,
            method: "POST",
            data: CityModel(newCity),
          }),
          invalidatesTags: ["Cities", "City"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default CityApi;
export type CreateCityApiResponse = /** status 200 OK */ ICity;
export type CreateCityApiArg = PartialDeep<ICity>;

export type GetCitiesApiResponse = /** status 200 OK */ {
  results: ICity[];
  total: number;
};
export type GetCitiesApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  activeFilter?: string;
  stateIdFilter?: string,
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveCityApiResponse = unknown;
export type RemoveCityApiArg = string; /** City ids */

export type GetCityApiResponse = /** status 200 OK */ ICity;
export type GetCityApiArg = string;

export type UpdateCityApiResponse = unknown;
export type UpdateCityApiArg = ICity; // Cities

export const {
  useGetCitiesQuery,
  useCreateCityMutation,
  useRemoveCityMutation,
  useGetCityQuery,
  useUpdateCityMutation,
} = CityApi;

export type CityApiType = {
  [CityApi.reducerPath]: ReturnType<typeof CityApi.reducer>;
};