import ICategory from '../../categories-app/models/ICategory';
import ICity from '../../cities-app/models/ICity';
import IProduct from '../../products-app/models/IProduct';
import IStage from '../../stages-app/models/IStage';
import IState from '../../states-app/models/IState';
import IUser from '../../users-app/models/IUser';

export interface IOrderItemAction {
	id: string;
	employee: IUser;
	stage: IStage;
	startsAt?: string | null
	endsAt?: string | null;
}

export interface IOrderItem {
	id: string;
	category: ICategory;
	width: number;
	height: number;
	status: string;
	qrCode: string;
	note: string;
	product: IProduct;
	stages: IStage[];
	currentStage: IStage;
	price: number;
	orderItemActions: IOrderItemAction[];
}

interface IAddress {
	stateId: string;
	state: IState;
	cityId: string;
	city: ICity;
	street1: string;
	street2: string;
	postalCode: string;
	apartment: string;
	complex: string;
}

export default interface IOrder {
	id: string;
	priority?: string;
	note?: string;
	ref?: string;
	status?: string;
	outForDeliveryAt?: string | null;
	deliveredAt?: string | null;
	userId?: string;
	user?: IUser;
	driverId?: string | null;
	driver?: IUser;
	items?: IOrderItem[];
	address?: IAddress;
	createdAt?: string;
	updatedAt?: string;
}
