import IStage from "../../stages-app/models/IStage"

  export default interface IOperation {
  id: string;
  width?: number;
  height?: number;
  status?: string;
  note?: string;
  currentStageId?: string;
  currentStage?: IStage;
  stageIds?: string[];
  stage?: IStage[];
  createdAt?: string;
  updatedAt?: string;
}