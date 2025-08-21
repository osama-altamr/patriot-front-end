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

export interface ISaleSummary {
	totalRevenue: number;
	totalOrders: number;
	averageOrderValue: number;
	totalItemsSold: number;
}

export interface ISaleDailyTrend {
	date: string;
	totalRevenue: number;
	orderCount: number;
}

export interface ISaleBreakdownByProduct {
	id: string
	productId: string;
	productName: LocaleString;
	quantitySold: number;
	totalRevenue: number;
}

export interface ISaleBreakdownByCategory {
	id: string
	categoryId: string;
	categoryName: LocaleString;
	quantitySold: number;
	totalRevenue: number;
}

export interface ISaleBreakdownByState {
	id: string
	stateId: string;
	stateName: LocaleString;
	totalRevenue: number;
	orderCount: number;
}

export interface ISaleBreakdownByCity {
	id: string
	cityId: string;
	cityName: LocaleString;
	stateName: LocaleString;
	totalRevenue: number;
	orderCount: number;
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

	saleSummary?: ISaleSummary;
    saleDailyTrend?: ISaleDailyTrend[];
    saleBreakdownByProduct?: ISaleBreakdownByProduct[];
    saleBreakdownByCategory?: ISaleBreakdownByCategory[];
    salesBreakdownByState?: ISaleBreakdownByState[];
    salesBreakdownByCity?: ISaleBreakdownByCity[];
}