import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { PartialDeep } from 'type-fest';
import ProductModel, { productEditableFields } from './models/ProductModel';
import IProduct from './models/IProduct';

export const addTagTypes = ['Products', 'Product'] as const;

const ProductApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getProducts: build.query<GetProductsApiResponse, GetProductsApiArg>({
				query: (filters) => {
					let url = `v1/products?page=${filters.page}&limit=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.categoryIdFilter) {
						url += `&categoryId=${filters.categoryIdFilter}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Products']
			}),
			removeProduct: build.mutation<RemoveProductApiResponse, RemoveProductApiArg>({
				query: (productId) => ({
					url: `v1/products/${productId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['Products', 'Product']
			}),
			getProduct: build.query<GetProductApiResponse, GetProductApiArg>({
				query: (productId) => ({
					url: `v1/products/${productId}`
				}),
				providesTags: ['Products', 'Product']
			}),
			updateProduct: build.mutation<UpdateProductApiResponse, UpdateProductApiArg>({
				query: (product) => ({
					url: `v1/products/${product.id}`,
					method: 'PATCH',
					data: _.pick(product, ...productEditableFields)
				}),
				invalidatesTags: ['Products', 'Product']
			}),
			createProduct: build.mutation<CreateProductApiResponse, CreateProductApiArg>({
				query: (newProduct) => ({
					url: `v1/products`,
					method: 'POST',
					data: ProductModel(newProduct)
				}),
				invalidatesTags: ['Products', 'Product']
			})
		}),
		overrideExisting: false
	});

export default ProductApi;
export type CreateProductApiResponse = /** status 200 OK */ IProduct;
export type CreateProductApiArg = PartialDeep<IProduct>;

export type GetProductsApiResponse = /** status 200 OK */ {
	results: IProduct[];
	total: number;
};
export type GetProductsApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;
	categoryIdFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type RemoveProductApiResponse = unknown;
export type RemoveProductApiArg = string; /** Product ids */

export type GetProductApiResponse = /** status 200 OK */ IProduct;
export type GetProductApiArg = string;

export type UpdateProductApiResponse = unknown;
export type UpdateProductApiArg = IProduct; // Products

export const {
	useGetProductsQuery,
	useCreateProductMutation,
	useRemoveProductMutation,
	useGetProductQuery,
	useUpdateProductMutation
} = ProductApi;

export type ProductApiType = {
	[ProductApi.reducerPath]: ReturnType<typeof ProductApi.reducer>;
};
