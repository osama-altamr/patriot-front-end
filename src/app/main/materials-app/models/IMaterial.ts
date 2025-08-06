import { LocaleString } from "src/app/main/utils/commonTypes";

  export default interface IMaterial {
  id: string;
  name?: LocaleString;
description?: LocaleString;
imageUrl?: string;
height?: number;
width?: number;
quantity?: number;
type?: string;
location?: string;
glassType?: string;
  
  createdAt?: string;
  updatedAt?: string;
}