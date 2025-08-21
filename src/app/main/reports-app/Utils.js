/* eslint-disable default-case */
export const reportType = {
	employee: 'employee',
	order: 'order',
	complaint: 'complaint',
	sale: 'sale'
};
export const toReportTypeTitle = (type) => {
	switch (type) {
		case reportType.employee:
			return 'EMPLOYEES';
		case reportType.order:
			return 'ORDERS';
		case reportType.complaint:
			return 'COMPLAINTS';
		case reportType.sale:
			return 'SALES';
	}

	return 'EMPLOYEES';
};
export const toReportTypeColor = (type) => {
	switch (type) {
		case reportType.employee:
			return 'bg-blue-500';
		case reportType.order:
			return 'bg-blue-500';
		case reportType.complaint:
			return 'bg-blue-500';
		case reportType.sale:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
