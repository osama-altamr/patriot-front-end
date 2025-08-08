import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AddItemDialog from './AddItemDialog';
import OrderItemCard from './OrderItemCard';
import IOrder, { IOrderItem } from '../../models/IOrder';

function ItemsTab() {
	const { t } = useTranslation('ordersApp');
	const { control } = useFormContext<IOrder>();

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
		product: any,
		material: any | null
	) => {
		const itemToAppend = {
			productId: product as string,
			materialId: material as string,
			width: newItemData.width,
			height: newItemData.height,
			note: newItemData.note,
			id: '',
			status: 'new',
			qrCode: ''
		};

		console.log(itemToAppend)
		append(itemToAppend);
		setIsAddItemDialogOpen(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-16">
				<Typography className="text-2xl font-semibold">Items</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
					onClick={() => setIsAddItemDialogOpen(true)}
				>
					{t('ADD_NEW_ITEM')}
				</Button>
			</div>

			{fields.length === 0 ? (
				<Typography className="text-center p-24">{t('NO_ITEMS_IN_ORDER')}</Typography>
			) : (
				<div className="flex flex-col gap-16">
					{fields.map((item, index) => (
						<OrderItemCard
							key={item.id}
							item={fields[index] as IOrderItem}
						/>
					))}
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
