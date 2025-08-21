import { LocaleString } from '../../utils/commonTypes';

export default interface INotification {
	id: string;
	type?: 'order' | 'product' | 'system' | 'other';
	title?: LocaleString;
	content?: LocaleString;
	isSeen?: boolean;
	recordId?: string;
	createdAt?: string;
	updatedAt?: string;
	variant?: 'success' | 'info' | 'error' | 'warning';
	link?: string;
}
