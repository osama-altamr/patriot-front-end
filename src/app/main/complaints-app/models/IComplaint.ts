import IUser from '../../users-app/models/IUser';

export default interface IComplaint {
	id: string;
	description?: string;
	fileUrl?: string;
	location?: string;
	type?: string;
	status?: string;
	userId?: string;
	user?: IUser;
	closedById?: string;
	closedBy?: IUser;
	createdAt?: string;
	updatedAt?: string;
}
