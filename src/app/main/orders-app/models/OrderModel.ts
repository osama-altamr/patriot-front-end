import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import IOrder, { IOrderItem } from './IOrder';

/**
 * Builds the specific payload required for the POST /v1/orders endpoint.
 * This is different from the full IOrder model used for viewing.
 */
export const CreateOrderModel = (data: any) => {
	console.log(data)
	return {
		priority: data.priority || 'low',
		type: data.type || 'static', // Make type dynamic from form data
		address: {
			stateId: data.address?.stateId || null,
			cityId: data.address?.cityId || null,
			street1: data.address?.street1 || '',
			street2: data.address?.street2 || '',
			postalCode: data.address?.postalCode || '',
			apartment: data.address?.apartment || '',
			complex: data.address?.complex || ''
		},
		note: data.note || '',
		status: data.status || 'pending', // Make status dynamic from form data
		userId: data.userId || null,
		driverId: data.driverId || null,
		items:
			data.items?.map((item: any) => ({
				width: Number(item.width) || 0,
				height: Number(item.height) || 0,
				productId: item.productId,
				...(item.categoryId && { categoryId: item.categoryId }),
				...(item.materialId && { materialId: item.materialId }),
				note: item.note || ''
			})) || []
	};
};

/**
 * This model is for the form state, which aligns with the full VIEW model
 * fetched from the GET /v1/orders/:id endpoint.
 */
const OrderModel = (data: PartialDeep<IOrder>) =>
	_.defaults(data || {}, {
		id: null,
		priority: 'low',
		note: '',
		ref: '',
		status: 'pending',
		outForDeliveryAt: null,
		deliveredAt: null,
		userId: '',
		driverId: null,
		items: [] as IOrderItem[],
		address: {
			stateId: '',
			cityId: '',
			street1: '',
			street2: '',
			postalCode: '',
			apartment: '',
			complex: '',
		},
		createdAt: '',
		updatedAt: ''
	});

export const orderDefaultValues = OrderModel({});

// These fields are updatable via the PATCH endpoint.
export const orderEditableFields = ['priority', 'note', 'status', 'userId', 'driverId'];

export default OrderModel