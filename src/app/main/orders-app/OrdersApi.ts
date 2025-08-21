import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
// Import both models now
import { orderEditableFields, CreateOrderModel } from './models/OrderModel';
import IOrder from './models/IOrder';

export const addTagTypes = ['Orders', 'Order'] as const;

export type CreateOrderPayload = {
	priority: string;
	total: number
	address: {
		stateId: string;
		cityId: string;
		street1: string;
		street2: string;
		postalCode: string;
		apartment: string;
		complex: string;
	};
	note: string;
	driverId: string
	userId: string;
	items: {
		width: number;
		height: number;
		productId: string;
		categoryId: string;
		materialId: string;
		note: string;
	}[];
};

const OrderApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getOrders: build.query<GetOrdersApiResponse, GetOrdersApiArg>({
				query: (filters) => {
					let url = `v1/orders?page=${filters.page}&pageSize=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.priorityFilter !== 'all') {
						url += `&priority=${filters.priorityFilter}`;
					}

					if (filters.statusFilter !== 'all') {
						url += `&status=${filters.statusFilter}`;
					}

					if (filters.userIdFilter) {
						url += `&userId=${filters.userIdFilter}`;
					}

					if (filters.driverIdFilter) {
						url += `&driverId=${filters.driverIdFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Orders']
			}),
			removeOrder: build.mutation<RemoveOrderApiResponse, RemoveOrderApiArg>({
				query: (orderId) => ({
					url: `v1/orders/${orderId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['Orders', 'Order']
			}),
			getOrder: build.query<GetOrderApiResponse, GetOrderApiArg>({
				query: (orderId) => ({
					url: `v1/orders/${orderId}`
				}),
				providesTags: ['Orders', 'Order']
			}),
			updateOrder: build.mutation<UpdateOrderApiResponse, UpdateOrderApiArg>({
				query: (order) => ({
					url: `v1/orders/${order.id}`,
					method: 'PATCH',
					data: _.pick(order, ...orderEditableFields)
				}),
				invalidatesTags: ['Orders', 'Order']
			}),
			createOrder: build.mutation<CreateOrderApiResponse, CreateOrderApiArg>({
				query: (newOrderData) => ({
					url: `v1/orders`,
					method: 'POST',
					data: CreateOrderModel(newOrderData)
				}),
				invalidatesTags: ['Orders', 'Order']
			}),
			updateOrderItem: build.mutation<UpdateOrderItemApiResponse, UpdateOrderItemApiArg>({
				query: ({ itemId, ...body }) => ({
					url: `v1/orders/items/${itemId}`,
					method: 'PATCH',
					data: body
				}),
				invalidatesTags: ['Order'],
			}),
		}),
		overrideExisting: false
	});

export default OrderApi;

export type CreateOrderApiResponse = /** status 200 OK */ IOrder;
// The argument for the create hook is now our specific payload type
export type CreateOrderApiArg = PartialDeep<CreateOrderPayload>;

export type GetOrdersApiResponse = /** status 200 OK */ {
	results: IOrder[];
	total: number;
};

export type UpdateOrderItemApiArg = {
	itemId: string;
	price?: number;
	// You can add other editable fields here in the future, e.g., note?: string
};

export type GetOrdersApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;
	priorityFilter?: string;
	statusFilter?: string;
	userIdFilter?: string;
	driverIdFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveOrderApiResponse = unknown;
export type RemoveOrderApiArg = string; /** Order id */

export type GetOrderApiResponse = /** status 200 OK */ IOrder;
export type GetOrderApiArg = string;

export type UpdateOrderApiResponse = unknown;
export type UpdateOrderApiArg = IOrder;

export const {
	useGetOrdersQuery,
	useCreateOrderMutation,
	useRemoveOrderMutation,
	useGetOrderQuery,
	useUpdateOrderMutation,
	useUpdateOrderItemMutation,
} = OrderApi;

export type OrderApiType = {
	[OrderApi.reducerPath]: ReturnType<typeof OrderApi.reducer>;
};
