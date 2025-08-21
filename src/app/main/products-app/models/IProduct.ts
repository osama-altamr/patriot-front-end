import { LocaleString } from 'src/app/main/utils/commonTypes';
import ICategory from '../../categorys-app/models/ICategory';
import IStage from '../../stages-app/models/IStage';

export default interface IProduct {
	id: string;
	name?: LocaleString;
	description?: LocaleString;
	imageUrl?: string;
	height?: number;
	width?: number;
	categoryId?: string;
	category?: ICategory;
	stageIds?: string[];
	stages?: IStage[];
	createdAt?: string;
	updatedAt?: string;
	pricePerSquareMeter?: number;
}
