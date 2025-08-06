import { LocaleString } from "src/app/main/utils/commonTypes";

  export default interface IStage {
  id: string;
  name?: LocaleString;
description?: LocaleString;
imageUrl?: string;
estimatedTimeMinutes?: number;
  
  createdAt?: string;
  updatedAt?: string;
}