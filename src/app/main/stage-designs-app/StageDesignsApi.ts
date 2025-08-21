import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import StageDesignModel, { stageDesignEditableFields } from "./models/StageDesignModel";
import IStageDesign from "./models/IStageDesign";

export const addTagTypes = ["StageDesigns", "StageDesign"] as const;

const StageDesignApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStageDesigns: build.query<GetStageDesignsApiResponse, GetStageDesignsApiArg>({
        query: (filters) => {
          var url = `v1/stage-patterns?page=${filters.page}&pageSize=${filters.pageSize}`;
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
        providesTags: ["StageDesigns"],
      }),
      removeStageDesign: build.mutation<RemoveStageDesignApiResponse, RemoveStageDesignApiArg>(
        {
          query: (stageDesignId) => ({
            url: `v1/stage-patterns/${stageDesignId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["StageDesigns", "StageDesign"],
        }
      ),
      getStageDesign: build.query<GetStageDesignApiResponse, GetStageDesignApiArg>({
        query: (stageDesignId) => ({
          url: `v1/stage-patterns/${stageDesignId}`,
        }),
        providesTags: ["StageDesigns", "StageDesign"],
      }),
      updateStageDesign: build.mutation<UpdateStageDesignApiResponse, UpdateStageDesignApiArg>(
        {
          query: (stageDesign) => ({
            url: `v1/stage-patterns/${stageDesign.id}`,
            method: "PATCH",
            data: _.pick(stageDesign, ...stageDesignEditableFields),
          }),
          invalidatesTags: ["StageDesigns", "StageDesign"],
        }
      ),
      createStageDesign: build.mutation<CreateStageDesignApiResponse, CreateStageDesignApiArg>(
        {
          query: (newStageDesign) => ({
            url: `v1/stage-patterns`,
            method: "POST",
            data: StageDesignModel(newStageDesign),
          }),
          invalidatesTags: ["StageDesigns", "StageDesign"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default StageDesignApi;
export type CreateStageDesignApiResponse = /** status 200 OK */ IStageDesign;
export type CreateStageDesignApiArg = PartialDeep<IStageDesign>;

export type GetStageDesignsApiResponse = /** status 200 OK */ {
  results: IStageDesign[];
  total: number;
};
export type GetStageDesignsApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  
  
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveStageDesignApiResponse = unknown;
export type RemoveStageDesignApiArg = string; /** StageDesign ids */

export type GetStageDesignApiResponse = /** status 200 OK */ IStageDesign;
export type GetStageDesignApiArg = string;

export type UpdateStageDesignApiResponse = unknown;
export type UpdateStageDesignApiArg = IStageDesign; // StageDesigns

export const {
  useGetStageDesignsQuery,
  useCreateStageDesignMutation,
  useRemoveStageDesignMutation,
  useGetStageDesignQuery,
  useUpdateStageDesignMutation,
} = StageDesignApi;

export type StageDesignApiType = {
  [StageDesignApi.reducerPath]: ReturnType<typeof StageDesignApi.reducer>;
};