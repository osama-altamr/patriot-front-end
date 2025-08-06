import { LocaleString } from "src/app/main/utils/commonTypes";

  export default interface IReport {
  id: string;
  name?: LocaleString;
type?: string;
startDate?: string;
endDate?: string;
  
  createdAt?: string;
  updatedAt?: string;
}