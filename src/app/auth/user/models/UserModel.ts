import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { User } from 'src/app/auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		role: null,
		name: '',
		email: '',
		address: {}
	});
}

export const userDefaultValues = UserModel({});

export const userEditableFields = ['name', 'address'];

export default UserModel;
