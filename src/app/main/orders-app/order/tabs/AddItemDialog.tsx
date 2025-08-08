import { useForm, Controller } from 'react-hook-form';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	FormControl,
	FormHelperText
} from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import localeString from 'src/app/main/utils/localeString';

const newItemSchema = z.object({
	product: z.any(),
	material: z.any().optional().nullable(),
	width: z.string().transform(Number).pipe(z.number().min(0.1, 'Width must be a positive number')),
	height: z.string().transform(Number).pipe(z.number().min(0.1, 'Height must be a positive number')),
	note: z.string().optional()
});

export type NewItemFormType = z.infer<typeof newItemSchema>;

interface AddItemDialogProps {
	open: boolean;
	onClose: () => void;
	onAdd: (
		data: {
			productId: string;
			materialId?: string;
			width: number;
			height: number;
			note?: string;
		},
		product: any,
		material: any | null
	) => void;
}

function AddItemDialog({ open, onClose, onAdd }: AddItemDialogProps) {
	const { t } = useTranslation('ordersApp');

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid }
	} = useForm<NewItemFormType>({
		resolver: zodResolver(newItemSchema),
		defaultValues: {
			product: null,
			material: null,
			width: '',
			height: '',
			note: ''
		},
		mode: 'onChange'
	});

	const onSubmit = (data: NewItemFormType) => {
		onAdd(
			{
				productId: data.product.id,
				materialId: data.material?.id ?? '',
				width: data.width,
				height: data.height,
				note: data.note
			},
			data.product,
			data.material
		);
		handleClose();
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle>{t('ADD_NEW_ITEM')}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<div className="flex flex-col gap-24 py-16">
						<Controller
							name="product"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.product}
								>
									<CustomAutoComplete
										{...field}
										label={t('PRODUCT')}
										placeholder={t('SELECT_SINGLE_PRODUCT')}
										getItemUrl="v1/products"
										getItemsUrl="v1/products"
										required
										onChange={(value) => field.onChange(value)}
										getOptionLabel={(option: any) => localeString(option?.name) || ''}
										isOptionEqualToValue={(option, value) => option?.id === value?.id}
									/>
									{errors.product && (
										<FormHelperText>
											{typeof errors.product.message === 'string' && errors.product.message}
										</FormHelperText>
									)}
								</FormControl>
							)}
						/>

						<Controller
							name="material"
							control={control}
							render={({ field }) => (
								<FormControl
									fullWidth
									error={!!errors.material}
								>
									<CustomAutoComplete
										{...field}
										label={t('MATERIAL_OPTIONAL')}
										placeholder={t('SELECT_SINGLE_MATERIAL')}
										getItemUrl="v1/materials"
										getItemsUrl="v1/materials"
										required={false}
										onChange={(value) => field.onChange(value)}
										getOptionLabel={(option: any) => localeString(option?.name) || ''}
										isOptionEqualToValue={(option, value) => option?.id === value?.id}
									/>
									{errors.material && (
										<FormHelperText>
											{typeof errors.material.message === 'string' && errors.material.message}
										</FormHelperText>
									)}
								</FormControl>
							)}
						/>

						<Controller
							name="width"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('WIDTH')}
									type="number"
									fullWidth
									error={!!errors.width}
									helperText={errors.width?.message}
								/>
							)}
						/>

						<Controller
							name="height"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('HEIGHT')}
									type="number"
									fullWidth
									error={!!errors.height}
									helperText={errors.height?.message}
								/>
							)}
						/>

						<Controller
							name="note"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={t('NOTE')}
									multiline
									rows={3}
									fullWidth
								/>
							)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t('CANCEL')}</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={!isValid}
					>
						{t('ADD_ITEM')}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default AddItemDialog;