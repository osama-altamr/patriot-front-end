import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import StageModel, { stageEditableFields } from "./models/StageModel";
import IStage from "./models/IStage";

export const addTagTypes = ["Stages", "Stage"] as const;

const StageApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getStages: build.query<GetStagesApiResponse, GetStagesApiArg>({
        query: (filters) => {
          var url = `v1/stages?page=${filters.page}&limit=${filters.pageSize}`;
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
        providesTags: ["Stages"],
      }),
      removeStage: build.mutation<RemoveStageApiResponse, RemoveStageApiArg>({
        query: (stageId) => ({
          url: `v1/stages/${stageId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Stages", "Stage"],
      }),
      getStage: build.query<GetStageApiResponse, GetStageApiArg>({
        query: (stageId) => ({
          url: `v1/stages/${stageId}`,
        }),
        providesTags: ["Stages", "Stage"],
      }),
      updateStage: build.mutation<UpdateStageApiResponse, UpdateStageApiArg>({
        query: (stage) => ({
          url: `v1/stages/${stage.id}`,
          method: "PATCH",
          data: _.pick(stage, ...stageEditableFields),
        }),
        invalidatesTags: ["Stages", "Stage"],
      }),
      createStage: build.mutation<CreateStageApiResponse, CreateStageApiArg>({
        query: (newStage) => ({
          url: `v1/stages`,
          method: "POST",
          data: StageModel(newStage),
        }),
        invalidatesTags: ["Stages", "Stage"],
      }),
    }),
    overrideExisting: false,
  });

export default StageApi;
export type CreateStageApiResponse = /** status 200 OK */ IStage;
export type CreateStageApiArg = PartialDeep<IStage>;

export type GetStagesApiResponse = /** status 200 OK */ {
  results: IStage[];
  total: number;
};
export type GetStagesApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;

  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveStageApiResponse = unknown;
export type RemoveStageApiArg = string; /** Stage ids */

export type GetStageApiResponse = /** status 200 OK */ IStage;
export type GetStageApiArg = string;

export type UpdateStageApiResponse = unknown;
export type UpdateStageApiArg = IStage; // Stages

export const {
  useGetStagesQuery,
  useCreateStageMutation,
  useRemoveStageMutation,
  useGetStageQuery,
  useUpdateStageMutation,
} = StageApi;

export type StageApiType = {
  [StageApi.reducerPath]: ReturnType<typeof StageApi.reducer>;
};
