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
};
