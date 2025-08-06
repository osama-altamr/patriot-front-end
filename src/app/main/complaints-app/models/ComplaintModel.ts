import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IComplaint from "./IComplaint";


const ComplaintModel = (data: PartialDeep<IComplaint>) =>
  _.defaults(data || {}, {
    description: "",


type: "",

userId: "",

    
  });
export const complaintDefaultValues = ComplaintModel({});
export const complaintEditableFields = ["description", "fileUrl", "location", "type", "status", "userId", "closedById", ];

export default ComplaintModel;