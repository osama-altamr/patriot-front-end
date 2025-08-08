import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import IProduct from './IProduct';

const ProductModel = (data: PartialDeep<IProduct>) =>
	_.defaults(data || {}, {
		name: { en: '', ar: '' },
		height: 120,
		width: 120
	});
export const productDefaultValues = ProductModel({});
export const productEditableFields = ['name', 'description', 'imageUrl', 'height', 'width', 'categoryId', 'stageIds'];

export default ProductModel;
