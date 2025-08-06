import _ from "@lodash";
import { PartialDeep } from "type-fest";
import ICategory from "./ICategory";


const CategoryModel = (data: PartialDeep<ICategory>) =>
  _.defaults(data || {}, {
    
description: {en: "", ar: ""},

    
  });
export const categoryDefaultValues = CategoryModel({});
export const categoryEditableFields = ["name", "description", "imageUrl", ];

export default CategoryModel;