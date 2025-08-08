/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocaleString } from 'src/app/main/utils/commonTypes';

// --- Order Interfaces ---
export interface IOrderSummary {
	endDate: string;
	startDate: string;
	totalOrders: number;
	totalRevenue: number;
}

export interface IOrderBreakdown {
	count: number;
	status: string;
}

export interface IReportOrder {
	id: string;
	createdAt: string;
	status: string;
	[key: string]: any;
}

// --- Employee Interfaces ---
export interface IReportDriver {
	id?: string; // Add optional ID
	name: string;
	deliveredOrders: number;
	averageDeliveryTimeMinutes: number;
}

export interface IReportEmployee {
	id?: string; // Add optional ID
	name: string;
	averageTime: number;
	completedItems: number;
}

export interface IEmployeeBreakdown {
	drivers: IReportDriver[];
	employees: IReportEmployee[];
}

// --- Complaint Interfaces ---
export interface IComplaintSummary {
	endDate: string;
	startDate: string;
	openComplaints: number;
	totalComplaints: number;
	resolvedComplaints: number;
}

export interface IComplaintBreakdown {
	count: number;
	status?: string; // for status breakdown
	type?: string | null; // for type breakdown
}

// --- Main Report Interface ---
export default interface IReport {
	id: string;
	name?: LocaleString;
	type?: string;
	startDate?: string;
	endDate?: string;
	createdAt?: string;
	updatedAt?: string;
	xlsxUrl?: string;

	// Order properties
	orderSummary?: IOrderSummary;
	orderBreakdownByStatus?: IOrderBreakdown[];
	orders?: IReportOrder[];

	// Employee properties
	employeeBreakdownByType?: IEmployeeBreakdown;

	// Complaint properties
	complaintSummary?: IComplaintSummary;
	complaintBreakdownByStatus?: IComplaintBreakdown[];
	complaintBreakdownByType?: IComplaintBreakdown[];
}