import { LocaleString } from "src/app/main/utils/commonTypes";
import ICategory from "../../categorys-app/models/ICategory"

  export default interface IProduct {
  id: string;
  name?: LocaleString;
description?: LocaleString;
imageUrl?: string;
height?: number;
width?: number;
categoryId?: string;
category?: ICategory;
ratingsQuantity?: number;
ratingsAverage?: number;
  
  createdAt?: string;
  updatedAt?: string;
}