import { LocaleString } from "src/app/main/utils/commonTypes";

  export default interface IState {
  id: string;
  name?: LocaleString;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}