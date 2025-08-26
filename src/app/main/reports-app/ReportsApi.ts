import _ from "lodash";
import { apiService as api } from "app/store/apiService";
import { PartialDeep } from "type-fest";
import ReportModel, { reportEditableFields } from "./models/ReportModel";
import IReport from "./models/IReport";

export const addTagTypes = ["Reports", "Report"] as const;

const ReportApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getReports: build.query<GetReportsApiResponse, GetReportsApiArg>({
        query: (filters) => {
          var url = `v1/reports?page=${filters.page}&limit=${filters.pageSize}`;
          if (filters.searchText) {
            url += `&search=${filters.searchText}`;
          }
          
          if (filters.typeFilter !== "all") {
            url += `&type=${filters.typeFilter}`;
          }
          if (filters.dateFromFilter) {
            url += `&dateFrom=${filters.dateFromFilter}`;
          }
          if (filters.dateToFilter) {
            url += `&dateTo=${filters.dateToFilter}`;
          }
          return { url };
        },
        providesTags: ["Reports"],
      }),
      removeReport: build.mutation<RemoveReportApiResponse, RemoveReportApiArg>(
        {
          query: (reportId) => ({
            url: `v1/reports/${reportId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Reports", "Report"],
        }
      ),
      getReport: build.query<GetReportApiResponse, GetReportApiArg>({
        query: (reportId) => ({
          url: `v1/reports/${reportId}`,
        }),
        providesTags: ["Reports", "Report"],
      }),
      updateReport: build.mutation<UpdateReportApiResponse, UpdateReportApiArg>(
        {
          query: (report) => ({
            url: `v1/reports/${report.id}`,
            method: "PATCH",
            data: _.pick(report, ...reportEditableFields),
          }),
          invalidatesTags: ["Reports", "Report"],
        }
      ),
      createReport: build.mutation<CreateReportApiResponse, CreateReportApiArg>(
        {
          query: (newReport) => ({
            url: `v1/reports`,
            method: "POST",
            data: ReportModel(newReport),
          }),
          invalidatesTags: ["Reports", "Report"],
        }
      ),
    }),
    overrideExisting: false,
  });

export default ReportApi;
export type CreateReportApiResponse = /** status 200 OK */ IReport;
export type CreateReportApiArg = PartialDeep<IReport>;

export type GetReportsApiResponse = /** status 200 OK */ {
  results: IReport[];
  total: number;
};
export type GetReportsApiArg = {
  page: number;
  pageSize: number;
  searchText?: string;
  
  typeFilter?: string,
  dateFromFilter?: string;
  dateToFilter?: string;
};

export type RemoveReportApiResponse = unknown;
export type RemoveReportApiArg = string; /** Report ids */

export type GetReportApiResponse = /** status 200 OK */ IReport;
export type GetReportApiArg = string;

export type UpdateReportApiResponse = unknown;
export type UpdateReportApiArg = IReport; // Reports

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useRemoveReportMutation,
  useGetReportQuery,
  useUpdateReportMutation,
} = ReportApi;

export type ReportApiType = {
  [ReportApi.reducerPath]: ReturnType<typeof ReportApi.reducer>;
};