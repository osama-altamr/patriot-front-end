import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import IStageDesign from './IStageDesign';

const StageDesignModel = (data: PartialDeep<IStageDesign>) =>
	_.defaults(data || {}, {
		title: { en: '', ar: '' },
		stageId: ''
	});
export const stageDesignDefaultValues = StageDesignModel({});
export const stageDesignEditableFields = ['title', 'imageUrl'];

export default StageDesignModel;
