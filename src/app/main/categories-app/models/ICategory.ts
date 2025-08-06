import { LocaleString } from "src/app/main/utils/commonTypes";

  export default interface ICategory {
  id: string;
  name?: LocaleString;
description?: LocaleString;
imageUrl?: string;
  
  createdAt?: string;
  updatedAt?: string;
}