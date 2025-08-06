import _ from "@lodash";
import { PartialDeep } from "type-fest";
import ICity from "./ICity";


const CityModel = (data: PartialDeep<ICity>) =>
  _.defaults(data || {}, {
    stateId: "",
name: {en: "", ar: ""},
    active: true,
  });
export const cityDefaultValues = CityModel({});
export const cityEditableFields = ["stateId", "name", "active",];

export default CityModel;