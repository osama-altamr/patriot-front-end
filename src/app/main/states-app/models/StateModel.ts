import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IState from "./IState";


const StateModel = (data: PartialDeep<IState>) =>
  _.defaults(data || {}, {
    name: {en: "", ar: ""},
    active: true,
  });
export const stateDefaultValues = StateModel({});
export const stateEditableFields = ["name", "isActive",];

export default StateModel;