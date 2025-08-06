import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IProduct from "./IProduct";


const ProductModel = (data: PartialDeep<IProduct>) =>
  _.defaults(data || {}, {
    name: {en: "", ar: ""},




categoryId: "",


    
  });
export const productDefaultValues = ProductModel({});
export const productEditableFields = ["name", "description", "imageUrl", "height", "width", "categoryId", ];

export default ProductModel;