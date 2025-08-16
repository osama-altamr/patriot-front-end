import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IOperation from "./IOperation";


const OperationModel = (data: PartialDeep<IOperation>) =>
  _.defaults(data || {}, {
    
  });
export const operationDefaultValues = OperationModel({});
export const operationEditableFields = [];

export default OperationModel;