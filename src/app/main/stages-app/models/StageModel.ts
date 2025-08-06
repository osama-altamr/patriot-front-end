import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IStage from "./IStage";


const StageModel = (data: PartialDeep<IStage>) =>
  _.defaults(data || {}, {
    name: {en: "", ar: ""},


estimatedTimeMinutes: 30,
    
  });
export const stageDefaultValues = StageModel({});
export const stageEditableFields = ["name", "description", "imageUrl", "estimatedTimeMinutes", ];

export default StageModel;