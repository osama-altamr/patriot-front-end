import IStage from "src/app/main/stages-app/models/IStage";

export const userRoles = {
	admin: 'admin',
	organization: 'organization'
};
/**
 * The type definition for a user object.
 */
export type Address = {
	stateId: string;
	cityId: string;
	street1: string;
	postalCode?: string;
	apartment?: string;
	complex?: string;
};

export enum UserAcessType {
	driver = 'driver',
	admin = 'admin',
	owner = 'owner',
	employee = 'employee'
}

interface Scope {
	read: boolean;
	write: boolean;
	feature: string;
}

export type Permission = {
	scope: Scope;
	accessType: UserAcessType;
	stageId: string
	stage: IStage
};

export type User = {
	id: string;
	role?: string;
	photoUrl?: string;
	name?: string;
	email?: string;
	phoneNumber?: string;
	createdAt?: string;
	updatedAt?: string;
	address?: Address;
	permissions?: Permission;
};
