import { LocaleString } from 'src/app/main/utils/commonTypes';
import IStage from '../../stages-app/models/IStage';

export default interface IStageDesign {
	id: string;
	title?: LocaleString;
	imageUrl?: string;
	stageId?: string;
	stage?: IStage;

	createdAt?: string;
	updatedAt?: string;
}
