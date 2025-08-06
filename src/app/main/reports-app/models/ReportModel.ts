import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IReport from "./IReport";


const ReportModel = (data: PartialDeep<IReport>) =>
  _.defaults(data || {}, {
    name: {en: "", ar: ""},
type: "",
startDate: "",

    
  });
export const reportDefaultValues = ReportModel({});
export const reportEditableFields = ["name", "type", "startDate", ];

export default ReportModel;