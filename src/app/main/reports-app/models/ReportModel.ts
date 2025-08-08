import IReport from './IReport';
import { PartialDeep } from 'type-fest';

export const reportEditableFields: (keyof IReport)[] = [
	'name',
	'type',
	'startDate',
	'endDate',
];

export const reportDefaultValues: IReport = {
	id: null,
	name: { en: '', ar: ''},
	type: '',
	startDate: new Date().toISOString(),
	endDate: null,
	xlsxUrl: null,
	// Order defaults
	orderSummary: null,
	orderBreakdownByStatus: [],
	orders: [],
	// Employee defaults
	employeeBreakdownByType: { drivers: [], employees: [] },
	// Complaint defaults
	complaintSummary: null,
	complaintBreakdownByStatus: [],
	complaintBreakdownByType: [],
};

function ReportModel(data: PartialDeep<IReport>): IReport {
	const report = { ...reportDefaultValues, ...data };
	return report;
}

export default ReportModel;