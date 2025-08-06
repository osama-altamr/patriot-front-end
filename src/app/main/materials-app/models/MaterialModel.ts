import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IMaterial from "./IMaterial";


const MaterialModel = (data: PartialDeep<IMaterial>) =>
  _.defaults(data || {}, {
    name: {en: "", ar: ""},




quantity: 0,



    
  });
export const materialDefaultValues = MaterialModel({});
export const materialEditableFields = ["name", "description","type", "imageUrl", "height", "width", "quantity", "location", "glassType", ];

export default MaterialModel;