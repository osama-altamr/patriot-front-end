import _ from "@lodash";
import { PartialDeep } from "type-fest";
import IUser from "./IUser";


const UserModel = (data: PartialDeep<IUser>) =>
  _.defaults(data || {}, {
    name: "",
email: "",


role: "user",
    
  });
export const userDefaultValues = UserModel({});
export const userEditableFields = ["name", "email", "phoneNumber", "photoUrl", "role", ];

export default UserModel;