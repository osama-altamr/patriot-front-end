export const complaintType = {
	maintenance: 'maintenance',
	noise: 'noise',
	cleanliness: 'cleanliness',
	staffBehavior: 'staffBehavior',
	technicalIssue: 'technicalIssue',
	other: 'other'
};
export const complaintStatus = {
	pending: 'pending',
	in_progress: 'in_progress',
	resolved: 'resolved',
	rejected: 'rejected'
};
export const toComplaintTypeTitle = (type) => {
	switch (type) {
		case complaintType.maintenance:
			return 'MAINTENANCE';
		case complaintType.noise:
			return 'NOISE';
		case complaintType.cleanliness:
			return 'CLEANLINESS';
		case complaintType.staffBehavior:
			return 'STAFF_BEHAVIOR';
		case complaintType.technicalIssue:
			return 'TECHNICAL_ISSUE';
		case complaintType.other:
			return 'OTHER';
	}
	return 'MAINTENANCE';
};
export const toComplaintStatusTitle = (status) => {
	switch (status) {
		case complaintStatus.pending:
			return 'PENDING';
		case complaintStatus.in_progress:
			return 'IN_PROGRESS';
		case complaintStatus.resolved:
			return 'RESOLVED';
		case complaintStatus.rejected:
			return 'REJECTED';
	}
	return 'PENDING';
};
export const toComplaintTypeColor = (type) => {
	switch (type) {
		case complaintType.maintenance:
			return 'bg-blue-500';
		case complaintType.noise:
			return 'bg-blue-500';
		case complaintType.cleanliness:
			return 'bg-blue-500';
		case complaintType.staffBehavior:
			return 'bg-blue-500';
		case complaintType.technicalIssue:
			return 'bg-blue-500';
		case complaintType.other:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
export const toComplaintStatusColor = (status) => {
	switch (status) {
		case complaintStatus.pending:
			return 'bg-blue-500';
		case complaintStatus.in_progress:
			return 'bg-blue-500';
		case complaintStatus.resolved:
			return 'bg-blue-500';
		case complaintStatus.rejected:
			return 'bg-blue-500';
	}
	return 'bg-blue-500';
};
