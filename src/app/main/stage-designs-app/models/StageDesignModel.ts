import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import IStageDesign from './IStageDesign';

const StageDesignModel = (data: PartialDeep<IStageDesign>) =>
	_.defaults(data || {}, {
		title: { en: '', ar: '' },
		stageId: 'c80a2b8b-78e8-43ed-b85c-69c5dc308f8c'
	});
export const stageDesignDefaultValues = StageDesignModel({});
export const stageDesignEditableFields = ['title', 'imageUrl'];

export default StageDesignModel;
