import _ from 'lodash';
import { apiService as api } from 'app/store/apiService';
import { notificationEditableFields } from './models/NotificationModel';
import INotification from './models/INotification';

export const addTagTypes = ['Notifications', 'Notification'] as const;

const NotificationApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getNotifications: build.query<GetNotificationsApiResponse, GetNotificationsApiArg>({
				query: (filters) => {
					let url = `v1/notifications?page=${filters.page}&limit=${filters.pageSize}`;

					if (filters.searchText) {
						url += `&search=${filters.searchText}`;
					}

					if (filters.isSeenFilter !== 'all') {
						url = `v1/notifications/unread?page=${filters.page}&limit=${filters.pageSize}`;
					}

					if (filters.dateFromFilter) {
						url += `&dateFrom=${filters.dateFromFilter}`;
					}

					if (filters.dateToFilter) {
						url += `&dateTo=${filters.dateToFilter}`;
					}

					return { url };
				},
				providesTags: ['Notifications']
			}),
			getUnreadNotifications: build.query<GetUnreadNotificationsApiResponse, GetUnreadNotificationsApiArg>({
				query: () => ({
					url: `v1/notifications?isSeen=${false}&orderColumn=createdAt&orderDirection=desc`
				}),
				providesTags: ['Notifications']
			}),
			dismissNotification: build.mutation<DismissNotificationApiResponse, DismissNotificationApiArg>({
				query: (notificationId) => ({
					url: `v1/notifications/dismiss`,
					method: 'POST',
					data: { notificationIds: [notificationId] }
				}),
				invalidatesTags: ['Notifications', 'Notification']
			}),
			dismissAllNotifications: build.mutation<DismissAllNotificationsApiResponse, DismissAllNotificationsApiArg>({
				async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
					try {
						for (let i = 0; i < _arg.length; i++) {
							await fetchWithBQ({
								url: `v1/notifications/dismiss`,
								method: 'POST',
								data: { notificationIds: [_arg[i]] }
							});
						}
					} catch (e) {
						console.log(e, 'error');
					}
					return { data: null };
				},
				invalidatesTags: ['Notifications', 'Notification']
			}),
			getNotification: build.query<GetNotificationApiResponse, GetNotificationApiArg>({
				query: (notificationId) => ({
					url: `v1/notifications/${notificationId}`
				}),
				providesTags: ['Notifications', 'Notification']
			}),
			updateNotification: build.mutation<UpdateNotificationApiResponse, UpdateNotificationApiArg>({
				query: (notification) => ({
					url: `v1/notifications/${notification.id}`,
					method: 'PATCH',
					data: _.pick(notification, ...notificationEditableFields)
				}),
				invalidatesTags: ['Notifications', 'Notification']
			})
		}),
		overrideExisting: false
	});

export default NotificationApi;

export type GetNotificationsApiResponse = /** status 200 OK */ {
	results: INotification[];
	total: number;
};
export type GetNotificationsApiArg = {
	page: number;
	pageSize: number;
	searchText?: string;
	isSeenFilter?: string;
	dateFromFilter?: string;
	dateToFilter?: string;
};

export type GetUnreadNotificationsApiResponse = /** status 200 OK */ {
	results: INotification[];
	total: number;
};
export type GetUnreadNotificationsApiArg = void;

export type DismissNotificationApiResponse = unknown;
export type DismissNotificationApiArg = string; /** Notification ids */

export type DismissAllNotificationsApiResponse = any;
export type DismissAllNotificationsApiArg = string[]; /** Notification ids */

export type GetNotificationApiResponse = /** status 200 OK */ INotification;
export type GetNotificationApiArg = string;

export type UpdateNotificationApiResponse = unknown;
export type UpdateNotificationApiArg = INotification; // Notifications

export const {
	useGetNotificationsQuery,
	useGetUnreadNotificationsQuery,
	useGetNotificationQuery,
	useUpdateNotificationMutation,
	useDismissNotificationMutation,
	useDismissAllNotificationsMutation
} = NotificationApi;

export type NotificationApiType = {
	[NotificationApi.reducerPath]: ReturnType<typeof NotificationApi.reducer>;
};

const mockData: INotification[] = [
	{
		senderId: '65a9d0b0d7c8a5f222356940',
		receiverId: '678d5461e3a0cea9b91e679b',
		senderType: 'Organization',
		receiverType: 'Student',
		type: 'order',
		title: 'New Order',
		content: 'A new order has been created for you by Local Test Domain Manager',
		isSeen: false,
		createdAt: '2025-01-22T00:54:46.617Z',
		updatedAt: '2025-01-22T00:54:46.617Z',
		id: '679041d603be8179b7122486'
	},
	{
		senderId: '65a9d0b0d7c8a5f222356940',
		receiverId: '678d5461e3a0cea9b91e679b',
		senderType: 'Organization',
		receiverType: 'Student',
		type: 'order',
		title: 'New Order',
		content: 'A new order has been created for you by Local Test Domain Manager',
		isSeen: false,
		createdAt: '2025-01-22T00:54:46.617Z',
		updatedAt: '2025-01-22T00:54:46.617Z',
		id: '679041d603be8179b7122487'
	}
];
