import IUser from '../../users-app/models/IUser';
import IStage from '../../stages-app/models/IStage';

export interface IEmployeeScope {
	feature: string;
	read: boolean;
	write: boolean;
}

export default interface IEmployee {
	id: string;
	userId?: string;
	user?: IUser;
	stageId?: string;
	stage?: IStage;
	accessType?: string;
	scopes?: IEmployeeScope[];
	createdAt?: string;
	updatedAt?: string;
}
