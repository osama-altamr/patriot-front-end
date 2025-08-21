import { useState } from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	Tooltip,
	Stack
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { format } from 'date-fns';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import localeString from 'src/app/main/utils/localeString';
import { IOrderItem, IOrderItemAction } from '../../models/IOrder';
import { useUpdateOrderItemMutation } from '../../OrdersApi';

// --- Helper Functions and Configs ---
const getDuration = (start?: string, end?: string) => {
	if (!start || !end) return 'In Progress';
	const diff = new Date(end).getTime() - new Date(start).getTime();
	const minutes = Math.floor(diff / 60000);
	const seconds = ((diff % 60000) / 1000).toFixed(0);
	return `${minutes}m ${seconds}s`;
};

const statusConfig = {
	pending: {
		labelKey: 'PENDING',
		colorClass: 'bg-yellow-500'
	},
	inProgress: {
		labelKey: 'IN_PROGRESS',
		colorClass: 'bg-blue-500'
	},
	completed: {
		labelKey: 'COMPLETED',
		colorClass: 'bg-green-500'
	}
};

// --- Child Component: Dialog for editing the price ---
function EditPriceDialog({ open, onClose, onSubmit, item }) {
	const { t } = useTranslation('ordersApp');
	const schema = z.object({
		price: z.coerce.number().min(0, 'Price cannot be negative')
	});
	const { control, handleSubmit, formState: { errors } } = useForm({
		resolver: zodResolver(schema),
		defaultValues: { price: item.price || 0 }
	});

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>{t('UPDATE_ITEM_PRICE')}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Controller
						name="price"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('PRICE')}
								type="number"
								fullWidth
								autoFocus
								error={!!errors.price}
								helperText={errors.price?.message as string}
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>{t('CANCEL')}</Button>
					<Button type="submit" variant="contained" color="primary">{t('SAVE')}</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

// --- Child Component: Table for displaying action history ---
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
				{actions?.map((action) => (
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

// --- Define the props for the main component, including orderStatus ---
interface OrderItemCardProps {
	item: IOrderItem;
	orderStatus?: string;
	itemId?: string
}

function OrderItemCard({ item, orderStatus, itemId }: OrderItemCardProps) {
	const { t } = useTranslation('ordersApp');
	const dispatch = useDispatch();

	const isOrderCompleted = orderStatus === 'completed';
	const isNewItem = !item.id; // An item is "new" if it doesn't have a database ID.
	const isEditable = !isOrderCompleted && !isNewItem;

	const [isEditDialogOpen, setEditDialogOpen] = useState(false);
	const [updateOrderItem, { isLoading }] = useUpdateOrderItemMutation();

	const handleUpdatePrice = (formData: { price: number }) => {
		if (!isEditable) {
			dispatch(showMessage({ message: t('CANNOT_EDIT_ITEM'), variant: 'error' }));
			return;
		}

		updateOrderItem({ itemId, price: formData.price })
			.unwrap()
			.then(() => {
				dispatch(showMessage({ message: t('ITEM_PRICE_UPDATED'), variant: 'success' }));
				setEditDialogOpen(false);
			})
			.catch(() => {
				dispatch(showMessage({ message: t('ERROR_UPDATING_PRICE'), variant: 'error' }));
			});
	};

	if (!item) {
		return null; // Safety check to prevent crashes if item is undefined
	}

	return (
		<>
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
							<Typography variant="h6" className="font-semibold">
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
							<div className="flex justify-between items-start">
								<Typography className="font-semibold mb-4">{t('ITEM_DETAILS')}</Typography>
								<Tooltip title={!isEditable ? t('CANNOT_EDIT_ITEM') : ''}>
									<span>
										<Button
											variant="outlined"
											size="small"
											startIcon={<Icon>edit</Icon>}
											onClick={() => setEditDialogOpen(true)}
											disabled={!isEditable}
										>
											{t('EDIT')}
										</Button>
									</span>
								</Tooltip>
							</div>
							<Box
								sx={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
									gap: '8px 16px',
									mt: 2
								}}
							>
								<div>
									<Typography variant="caption" color="text.secondary">{t('CATEGORY')}</Typography>
									<Typography>{localeString(item.category?.name) || 'N/A'}</Typography>
								</div>
								<div>
									<Typography variant="caption" color="text.secondary">{t('MATERIAL')}</Typography>
									<Typography>{localeString(item.material?.name) || 'N/A'}</Typography>
								</div>
								<div>
									<Typography variant="caption" color="text.secondary">{t('DIMENSIONS')}</Typography>
									<Typography>{`${item.width || '-'} x ${item.height || '-'}`}</Typography>
								</div>
								<div>
									<Typography variant="caption" color="text.secondary">{t('CURRENT_STAGE')}</Typography>
									<Typography>{localeString(item.currentStage?.name) || 'N/A'}</Typography>
								</div>
								<div>
									<Typography variant="caption" color="text.secondary">{t('PRICE')}</Typography>
									<Typography fontWeight="bold">{Number(item.price || 0).toFixed(2)}</Typography>
								</div>
								<div>
									<Typography variant="caption" color="text.secondary">{t('ITEM_STATUS')}</Typography>
									{item.status ? (
										<Chip
											label={t(statusConfig[item.status]?.labelKey || 'UNKNOWN_STATUS')}
											className={statusConfig[item.status]?.colorClass || 'bg-gray-400'}
											classes={{ label: 'text-white' }}
											size="small"
										/>
									) : (
										<Chip label={t('NEW')} size="small" />
									)}
								</div>
							</Box>
							{item.note && (
								<div className="mt-16">
									<Typography variant="caption" color="text.secondary">{t('NOTE')}</Typography>
									<Typography className="whitespace-pre-wrap">{item.note}</Typography>
								</div>
							)}
						</div>
					</div>
					
					{!isNewItem && (
						<>
							{item.stages && item.stages.length > 0 && (
								<div className="mt-16">
									<Typography variant="caption" color="text.secondary" className="mb-4 block">{t('WORKFLOW_STAGES')}</Typography>
									<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
										{item.stages.map((stage) => (
											<Chip
												key={stage.id}
												label={localeString(stage.name)}
												variant={item.currentStage?.id === stage.id ? 'filled' : 'outlined'}
												color={item.currentStage?.id === stage.id ? 'secondary' : 'default'}
												size="small"
											/>
										))}
									</Stack>
								</div>
							)}
							{item.orderItemActions && item.orderItemActions.length > 0 && (
								<Accordion className="mt-16" variant="outlined">
									<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
										<Typography className="font-semibold">{t('ACTION_HISTORY')}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<OrderItemActionsTable actions={item.orderItemActions} />
									</AccordionDetails>
								</Accordion>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{isEditDialogOpen && (
				<EditPriceDialog
					open={isEditDialogOpen}
					onClose={() => setEditDialogOpen(false)}
					onSubmit={handleUpdatePrice}
					item={item}
				/>
			)}
		</>
	);
}

export default OrderItemCard;