import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AddItemDialog from './AddItemDialog';
import OrderItemCard from './OrderItemCard';
import IOrder, { IOrderItem } from '../../models/IOrder';

interface ItemsTabProps {
	order?: IOrder;
}

function ItemsTab({ order }: ItemsTabProps) {
	const { t } = useTranslation('ordersApp');
	const { control, watch } = useFormContext<IOrder>();

	const orderStatus = watch('status');
	const isOrderCompleted = orderStatus === 'completed';

	const { fields, append } = useFieldArray({
		control,
		name: 'items'
	});

	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

	const handleAddItem = (
		newItemData: {
			productId: string;
			materialId?: string;
			width: number;
			height: number;
			note?: string;
		},
		product: any, // This is the full product object from the autocomplete
		material: any | null
	) => {
		if (isOrderCompleted) return;

		const itemToAppend = {
			// Core data from the dialog
			width: newItemData.width,
			height: newItemData.height,
			note: newItemData.note,
			productId: product,
			materialId: material,
			id: '', // Must be undefined or missing, not an empty string
			price: 0,
			status: 'new', // A temporary status for display
			qrCode: '',
			currentStage: null,
		};

		append(itemToAppend);
		setIsAddItemDialogOpen(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-16">
				<Typography className="text-2xl font-semibold">{t('ITEMS')}</Typography>
				<Tooltip title={isOrderCompleted ? t('CANNOT_ADD_ITEM_TO_COMPLETED_ORDER') : ''}>
					<span> {/* Tooltip needs a span wrapper for disabled buttons */}
						<Button
							variant="contained"
							color="primary"
							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
							onClick={() => setIsAddItemDialogOpen(true)}
							disabled={isOrderCompleted}
						>
							{t('ADD_NEW_ITEM')}
						</Button>
					</span>
				</Tooltip>
			</div>

			{fields.length === 0 ? (
				<Typography className="text-center p-24">{t('NO_ITEMS_IN_ORDER')}</Typography>
			) : (
				<div className="flex flex-col gap-16">
					{fields.map((field, index) => {
						const originalItem = order?.items?.[index];

						const itemData = { ...originalItem, ...field } as IOrderItem;

						return (
							<OrderItemCard
								key={field.id} // Use the unique RHF id for the React key
								item={itemData}
								orderStatus={orderStatus}
								itemId={originalItem?.id}
							/>
						);
					})}
				</div>
			)}

			<AddItemDialog
				open={isAddItemDialogOpen}
				onClose={() => setIsAddItemDialogOpen(false)}
				onAdd={handleAddItem}
			/>
		</div>
	);
}

export default ItemsTab;