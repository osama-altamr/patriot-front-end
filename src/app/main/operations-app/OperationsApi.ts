import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
import OperationModel, { operationEditableFields } from './models/OperationModel';
import IOperation from './models/IOperation';
import IProduct from '../products-app/models/IProduct';

// Add the new tag for caching the grid results
export const addTagTypes = ['Operations', 'Operation', 'MaterialGrid'] as const;

const OperationApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			// --- Existing Endpoints ---
			getOperations: build.query<GetOperationsApiResponse, GetOperationsApiArg>({
				query: (filters) => {
					let url = `v1/orders/items?page=${filters.page}&pageSize=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.currentStageIdFilter) {
						url += `&currentStageId=${filters.currentStageIdFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Operations']
			}),

			removeOperation: build.mutation<RemoveOperationApiResponse, RemoveOperationApiArg>({
				query: (operationId) => ({
					url: `v1/operations/${operationId}`, // Note: This URL might need to change to v1/orders/items/:id
					method: 'DELETE'
				}),
				invalidatesTags: ['Operations', 'Operation']
			}),

			getOperation: build.query<GetOperationApiResponse, GetOperationApiArg>({
				query: (operationId) => ({
					url: `v1/operations/${operationId}` // Note: This URL might need to change to v1/orders/items/:id
				}),
				providesTags: ['Operations', 'Operation']
			}),

			updateOperation: build.mutation<UpdateOperationApiResponse, UpdateOperationApiArg>({
				query: (operation) => ({
					url: `v1/operations/${operation.id}`, // Note: This URL might need to change to v1/orders/items/:id
					method: 'PATCH',
					data: _.pick(operation, ...operationEditableFields)
				}),
				invalidatesTags: ['Operations', 'Operation']
			}),

			createOperation: build.mutation<CreateOperationApiResponse, CreateOperationApiArg>({
				query: (newOperation) => ({
					url: `v1/operations`, // Note: This URL might need to change to v1/orders/items
					method: 'POST',
					data: OperationModel(newOperation)
				}),
				invalidatesTags: ['Operations', 'Operation']
			}),

			// --- New Glass Cutting Endpoints ---
			runGlassCuttingAlgorithm: build.mutation<
				RunGlassCuttingAlgorithmApiResponse,
				RunGlassCuttingAlgorithmApiArg
			>({
				query: (body) => ({
					url: `v1/orders/glass-cutting`,
					method: 'POST',
					data: body
				}),
				invalidatesTags: ['MaterialGrid']
			}),

			getMaterialGrid: build.query<GetMaterialGridApiResponse, void>({
				query: () => ({
					url: `v1/orders/material-grid`
				}),
				providesTags: ['MaterialGrid']
			})
		}),
		overrideExisting: false
	});

export default OperationApi;

// --- Type Exports ---

export type CreateOperationApiResponse = /** status 200 OK */ IOperation;
export type CreateOperationApiArg = PartialDeep<IOperation>;

export type GetOperationsApiResponse = /** status 200 OK */ {
	results: IOperation[];
	total: number;
};
export type GetOperationsApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;
	currentStageIdFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveOperationApiResponse = unknown;
export type RemoveOperationApiArg = string; /** Operation ids */

export type GetOperationApiResponse = /** status 200 OK */ IOperation;
export type GetOperationApiArg = string;

export type UpdateOperationApiResponse = unknown;
export type UpdateOperationApiArg = IOperation;

// New Types for Glass Cutting
export type RunGlassCuttingAlgorithmApiResponse = {
	status: number;
	message: string;
};
export type RunGlassCuttingAlgorithmApiArg = {
	materialId?: string;
	width?: number;
	height?: number;
};

interface MaterialDimension {
	width: number;
	height: number;
}
interface Item {
	id: string;
	width: number;
	height: number;
	product: IProduct;
}
interface PackedItem {
	id: string;
	height: number;
	width: number;
	x: number;
	y: number;
	item: Item;
}

export type GetMaterialGridApiResponse = {
	packedItems: PackedItem[];
	materialDimensions: MaterialDimension;
	utilization: number;
};

// --- Hook Exports ---
export const {
	useGetOperationsQuery,
	useCreateOperationMutation,
	useRemoveOperationMutation,
	useGetOperationQuery,
	useUpdateOperationMutation,
	useRunGlassCuttingAlgorithmMutation,
	useGetMaterialGridQuery
} = OperationApi;

export type OperationApiType = {
	[OperationApi.reducerPath]: ReturnType<typeof OperationApi.reducer>;
};
