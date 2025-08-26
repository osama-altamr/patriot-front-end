import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
import ComplaintModel, { complaintEditableFields } from './models/ComplaintModel';
import IComplaint from './models/IComplaint';

export const addTagTypes = ['Complaints', 'Complaint'] as const;

const ComplaintApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getComplaints: build.query<GetComplaintsApiResponse, GetComplaintsApiArg>({
				query: (filters) => {
					let url = `v1/complaints?page=${filters.page}&limit=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.typeFilter !== 'all') {
						url += `&type=${filters.typeFilter}`;
					}

					if (filters.statusFilter !== 'all') {
						url += `&status=${filters.statusFilter}`;
					}

					if (filters.userIdFilter) {
						url += `&userId=${filters.userIdFilter}`;
					}

					if (filters.closedByIdFilter) {
						url += `&closedById=${filters.closedByIdFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Complaints']
			}),
			removeComplaint: build.mutation<RemoveComplaintApiResponse, RemoveComplaintApiArg>({
				query: (complaintId) => ({
					url: `v1/complaints/${complaintId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['Complaints', 'Complaint']
			}),
			getComplaint: build.query<GetComplaintApiResponse, GetComplaintApiArg>({
				query: (complaintId) => ({
					url: `v1/complaints/${complaintId}`
				}),
				providesTags: ['Complaints', 'Complaint']
			}),
			updateComplaint: build.mutation<UpdateComplaintApiResponse, UpdateComplaintApiArg>({
				query: (complaint) => ({
					url: `v1/complaints/${complaint.id}`,
					method: 'PATCH',
					data: _.pick(complaint, ...complaintEditableFields)
				}),
				invalidatesTags: ['Complaints', 'Complaint']
			}),
			createComplaint: build.mutation<CreateComplaintApiResponse, CreateComplaintApiArg>({
				query: (newComplaint) => ({
					url: `v1/complaints`,
					method: 'POST',
					data: ComplaintModel(newComplaint)
				}),
				invalidatesTags: ['Complaints', 'Complaint']
			})
		}),
		overrideExisting: false
	});

export default ComplaintApi;
export type CreateComplaintApiResponse = /** status 200 OK */ IComplaint;
export type CreateComplaintApiArg = PartialDeep<IComplaint>;

export type GetComplaintsApiResponse = /** status 200 OK */ {
	results: IComplaint[];
	total: number;
};
export type GetComplaintsApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;

	typeFilter?: string;
	statusFilter?: string;
	userIdFilter?: string;
	closedByIdFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveComplaintApiResponse = unknown;
export type RemoveComplaintApiArg = string; /** Complaint ids */

export type GetComplaintApiResponse = /** status 200 OK */ IComplaint;
export type GetComplaintApiArg = string;

export type UpdateComplaintApiResponse = unknown;
export type UpdateComplaintApiArg = IComplaint; // Complaints

export const {
	useGetComplaintsQuery,
	useCreateComplaintMutation,
	useRemoveComplaintMutation,
	useGetComplaintQuery,
	useUpdateComplaintMutation
} = ComplaintApi;

export type ComplaintApiType = {
	[ComplaintApi.reducerPath]: ReturnType<typeof ComplaintApi.reducer>;
};
