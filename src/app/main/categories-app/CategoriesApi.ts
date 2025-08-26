import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import CategoryModel, { categoryEditableFields } from "./models/CategoryModel";
import ICategory from "./models/ICategory";

export const addTagTypes = ["Categories", "Category"] as const;

const CategoryApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
        query: (filters) => {
          var url = `v1/categories?page=${filters.page}&limit=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          
          
          if (filters.dateFromFilter) {
            url += `&dateFrom=${filters.dateFromFilter}`;
          }
          if (filters.dateToFilter) {
            url += `&dateTo=${filters.dateToFilter}`;
          }
          return { url };
        },
        providesTags: ["Categories"],
      }),
      removeCategory: build.mutation<RemoveCategoryApiResponse, RemoveCategoryApiArg>(
        {
          query: (categoryId) => ({
            url: `v1/categories/${categoryId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Categories", "Category"],
        }
      ),
      getCategory: build.query<GetCategoryApiResponse, GetCategoryApiArg>({
        query: (categoryId) => ({
          url: `v1/categories/${categoryId}`,
        }),
        providesTags: ["Categories", "Category"],
      }),
      updateCategory: build.mutation<UpdateCategoryApiResponse, UpdateCategoryApiArg>(
        {
          query: (category) => ({
            url: `v1/categories/${category.id}`,
            method: "PATCH",
            data: _.pick(category, ...categoryEditableFields),
          }),
          invalidatesTags: ["Categories", "Category"],
        }
      ),
      createCategory: build.mutation<CreateCategoryApiResponse, CreateCategoryApiArg>(
        {
          query: (newCategory) => ({
            url: `v1/categories`,
            method: "POST",
            data: CategoryModel(newCategory),
          }),
          invalidatesTags: ["Categories", "Category"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default CategoryApi;
export type CreateCategoryApiResponse = /** status 200 OK */ ICategory;
export type CreateCategoryApiArg = PartialDeep<ICategory>;

export type GetCategoriesApiResponse = /** status 200 OK */ {
  results: ICategory[];
  total: number;
};
export type GetCategoriesApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  
  
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveCategoryApiResponse = unknown;
export type RemoveCategoryApiArg = string; /** Category ids */

export type GetCategoryApiResponse = /** status 200 OK */ ICategory;
export type GetCategoryApiArg = string;

export type UpdateCategoryApiResponse = unknown;
export type UpdateCategoryApiArg = ICategory; // Categories

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useRemoveCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} = CategoryApi;

export type CategoryApiType = {
  [CategoryApi.reducerPath]: ReturnType<typeof CategoryApi.reducer>;
};