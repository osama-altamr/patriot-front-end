import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import IEmployee from './IEmployee';

const EmployeeModel = (data: PartialDeep<IEmployee>) =>
	_.defaults(data || {}, {
		userId: '',

		accessType: '',
		scopes: []
	});
export const employeeDefaultValues = EmployeeModel({});
export const employeeEditableFields = ['userId', 'stageId', 'accessType', 'scopes'];

export default EmployeeModel;
