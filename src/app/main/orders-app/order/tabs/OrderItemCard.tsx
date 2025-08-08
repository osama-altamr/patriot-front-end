import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Card,
	CardContent,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import localeString from 'src/app/main/utils/localeString';
import { format } from 'date-fns';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IOrderItem, IOrderItemAction } from '../../models/IOrder';
import { toOrderStatusColor, toOrderStatusTitle } from '../../Utils';

const getDuration = (start?: string, end?: string) => {
	if (!start || !end) return 'In Progress';

	const diff = new Date(end).getTime() - new Date(start).getTime();
	const minutes = Math.floor(diff / 60000);
	const seconds = ((diff % 60000) / 1000).toFixed(0);
	return `${minutes}m ${seconds}s`;
};

function OrderItemActionsTable({ actions }: { actions: IOrderItemAction[] }) {
	const { t } = useTranslation('ordersApp');

	return (
		<Table size="small">
			<TableHead>
				<TableRow>
					<TableCell>{t('EMPLOYEE')}</TableCell>
					<TableCell>{t('STAGE')}</TableCell>
					<TableCell>{t('START_TIME')}</TableCell>
					<TableCell>{t('END_TIME')}</TableCell>
					<TableCell>{t('DURATION')}</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{actions.map((action) => (
					<TableRow key={action.id}>
						<TableCell>{action.employee?.name || 'N/A'}</TableCell>
						<TableCell>{localeString(action.stage?.name) || 'N/A'}</TableCell>
						<TableCell>{action.startsAt ? format(new Date(action.startsAt), 'Pp') : 'N/A'}</TableCell>
						<TableCell>{action.endsAt ? format(new Date(action.endsAt), 'Pp') : 'N/A'}</TableCell>
						<TableCell>{getDuration(action.startsAt, action.endsAt)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function OrderItemCard({ item }: { item: IOrderItem }) {
	const { t } = useTranslation('ordersApp');

	return (
		<Card className="mb-16">
			<CardContent>
				<div className="flex flex-col sm:flex-row gap-16">
					{/* Left Side: Product Info & QR */}
					<div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-16 sm:w-1/3">
						{item.product?.imageUrl && (
							<img
								src={item.product.imageUrl}
								alt={localeString(item.product.name)}
								className="w-128 h-128 object-cover rounded-lg"
							/>
						)}

						<Typography
							variant="h6"
							className="font-semibold"
						>
							{item.product ? localeString(item.product.name) : t('NEW_ITEM_PENDING')}
						</Typography>

						{item.qrCode && (
							<img
								src={item.qrCode}
								alt="QR Code"
								className="w-128 h-128 object-contain"
							/>
						)}
					</div>

					{/* Right Side: Details */}
					<div className="flex-1">
						<Typography className="font-semibold mb-4">{t('ITEM_DETAILS')}</Typography>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
								gap: '8px 16px'
							}}
						>
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('CATEGORY')}
								</Typography>
								<Typography>{localeString(item.category?.name) || 'N/A'}</Typography>
							</div>
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('MATERIAL')}
								</Typography>
								<Typography>{localeString(item.material?.name) || 'N/A'}</Typography>
							</div>
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('DIMENSIONS')}
								</Typography>
								<Typography>{`${item.width} x ${item.height}`}</Typography>
							</div>
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('CURRENT_STAGE')}
								</Typography>
								<Typography>{localeString(item.currentStage?.name) || 'N/A'}</Typography>
							</div>
							<div>
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('ITEM_STATUS')}
								</Typography>
								{item.status ? (
									<Chip
										label={t(toOrderStatusTitle(item.status))}
										className={toOrderStatusColor(item.status)}
										classes={{ label: 'text-white' }}
										size="small"
									/>
								) : (
									<Chip
										label={t('NEW')}
										size="small"
									/>
								)}
							</div>
						</Box>

						{item.note && (
							<div className="mt-16">
								<Typography
									variant="caption"
									color="text.secondary"
								>
									{t('NOTE')}
								</Typography>
								<Typography className="whitespace-pre-wrap">{item.note}</Typography>
							</div>
						)}
					</div>
				</div>

				{item.orderItemActions && item.orderItemActions.length > 0 && (
					<Accordion
						className="mt-16"
						variant="outlined"
					>
						<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
							<Typography className="font-semibold">{t('ACTION_HISTORY')}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<OrderItemActionsTable actions={item.orderItemActions} />
						</AccordionDetails>
					</Accordion>
				)}
			</CardContent>
		</Card>
	);
}

export default OrderItemCard;