import { LocaleString } from "src/app/main/utils/commonTypes";
import IState from "../../states-app/models/IState"

  export default interface ICity {
  id: string;
  stateId?: string;
state?: IState;
name?: LocaleString;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}