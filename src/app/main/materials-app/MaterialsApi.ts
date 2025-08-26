import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import MaterialModel, { materialEditableFields } from "./models/MaterialModel";
import IMaterial from "./models/IMaterial";

export const addTagTypes = ["Materials", "Material"] as const;

const MaterialApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getMaterials: build.query<GetMaterialsApiResponse, GetMaterialsApiArg>({
        query: (filters) => {
          var url = `v1/materials?page=${filters.page}&limit=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          
          if (filters.typeFilter !== "all") {
            url += `&type=${filters.typeFilter}`;
          }
if (filters.glassTypeFilter !== "all") {
            url += `&glassType=${filters.glassTypeFilter}`;
          }
          if (filters.dateFromFilter) {
            url += `&dateFrom=${filters.dateFromFilter}`;
          }
          if (filters.dateToFilter) {
            url += `&dateTo=${filters.dateToFilter}`;
          }
          return { url };
        },
        providesTags: ["Materials"],
      }),
      removeMaterial: build.mutation<RemoveMaterialApiResponse, RemoveMaterialApiArg>(
        {
          query: (materialId) => ({
            url: `v1/materials/${materialId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Materials", "Material"],
        }
      ),
      getMaterial: build.query<GetMaterialApiResponse, GetMaterialApiArg>({
        query: (materialId) => ({
          url: `v1/materials/${materialId}`,
        }),
        providesTags: ["Materials", "Material"],
      }),
      updateMaterial: build.mutation<UpdateMaterialApiResponse, UpdateMaterialApiArg>(
        {
          query: (material) => ({
            url: `v1/materials/${material.id}`,
            method: "PATCH",
            data: _.pick(material, ...materialEditableFields),
          }),
          invalidatesTags: ["Materials", "Material"],
        }
      ),
      createMaterial: build.mutation<CreateMaterialApiResponse, CreateMaterialApiArg>(
        {
          query: (newMaterial) => ({
            url: `v1/materials`,
            method: "POST",
            data: MaterialModel(newMaterial),
          }),
          invalidatesTags: ["Materials", "Material"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default MaterialApi;
export type CreateMaterialApiResponse = /** status 200 OK */ IMaterial;
export type CreateMaterialApiArg = PartialDeep<IMaterial>;

export type GetMaterialsApiResponse = /** status 200 OK */ {
  results: IMaterial[];
  total: number;
};
export type GetMaterialsApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  
  typeFilter?: string,
glassTypeFilter?: string,
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveMaterialApiResponse = unknown;
export type RemoveMaterialApiArg = string; /** Material ids */

export type GetMaterialApiResponse = /** status 200 OK */ IMaterial;
export type GetMaterialApiArg = string;

export type UpdateMaterialApiResponse = unknown;
export type UpdateMaterialApiArg = IMaterial; // Materials

export const {
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useRemoveMaterialMutation,
  useGetMaterialQuery,
  useUpdateMaterialMutation,
} = MaterialApi;

export type MaterialApiType = {
  [MaterialApi.reducerPath]: ReturnType<typeof MaterialApi.reducer>;
};