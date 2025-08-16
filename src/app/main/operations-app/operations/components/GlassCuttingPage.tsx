import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';

import localeString from 'src/app/main/utils/localeString';
import MaterialGridDisplay from './MaterialGridDisplay';
import { useRunGlassCuttingAlgorithmMutation } from '../../OperationsApi';

const glassCuttingSchema = z
	.object({
		materialId: z.string().optional().nullable(),
		width: z.coerce.number({ invalid_type_error: 'Width must be a number' }).positive().optional().nullable(),
		height: z.coerce.number({ invalid_type_error: 'Height must be a number' }).positive().optional().nullable()
	})
	.refine((data) => !!data.materialId || (!!data.width && !!data.height), {
		message: 'Either select a material or provide both width and height.',
		path: ['materialId'] // Keep error on a general field or choose one
	});

type GlassCuttingFormType = z.infer<typeof glassCuttingSchema>;

function GlassCuttingPage() {
	const { t } = useTranslation('operationsApp');
	const dispatch = useDispatch();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [runAlgorithm, { isLoading }] = useRunGlassCuttingAlgorithmMutation();

	const methods = useForm<GlassCuttingFormType>({
		resolver: zodResolver(glassCuttingSchema),
		defaultValues: {
			materialId: null,
			width: null,
			height: null
		}
	});
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = methods;

	const handleOpenDialog = () => setIsDialogOpen(true);
	const handleCloseDialog = () => setIsDialogOpen(false);

	const onSubmit = (data: GlassCuttingFormType) => {
		runAlgorithm(data)
			.unwrap()
			.then((response) => {
				dispatch(showMessage({ message: response.message, variant: 'success' }));
				handleCloseDialog();
			})
			.catch((error) => {
				dispatch(showMessage({ message: error.data?.message || t('ALGORITHM_FAILED'), variant: 'error' }));
			});
	};

	return (
		<div className="p-24 flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-16">{t('GLASS_CUTTING_OPTIMIZATION')}</h1>
			<Button
				variant="contained"
				color="secondary"
				onClick={handleOpenDialog}
			>
				{t('RUN_OPTIMIZATION_ALGORITHM')}
			</Button>

			<Dialog
				open={isDialogOpen}
				onClose={handleCloseDialog}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>{t('ALGORITHM_INPUT')}</DialogTitle>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogContent>
							<p className="mb-16">{t('PROVIDE_MATERIAL_OR_DIMENSIONS')}</p>
							<Controller
								name="materialId"
								control={control}
								render={({ field }) => (
									<CustomAutoComplete
										{...field}
										required={false}
										label={t('MATERIAL_OPTIONAL')}
										placeholder={t('SELECT_SINGLE_MATERIAL')}
										getItemUrl="v1/materials" // Use your material endpoint
										getItemsUrl="v1/materials"
										getOptionLabel={(option: any) => localeString(option?.name) || ''}
										isOptionEqualToValue={(option, value) => option?.id === value?.id}
										error={!!errors.materialId}
									/>
								)}
							/>
							<div className="flex space-x-16 my-16">
								<Controller
									name="width"
									control={control}
									render={(
										{ field, fieldState: { error } } // Destructure error from fieldState
									) => (
										<TextField
											{...field}
											label={t('WIDTH')}
											type="number"
											fullWidth
											// Add error handling props
											error={!!error}
											helperText={error?.message}
											// When coercing, an empty string becomes 0, which isn't positive.
											// It's better to treat an empty field as null.
											onChange={(e) => {
												const { value } = e.target;
												field.onChange(value === '' ? null : value);
											}}
											value={field.value ?? ''} // Ensure value is not null for the input
										/>
									)}
								/>
								<Controller
									name="height"
									control={control}
									render={(
										{ field, fieldState: { error } } // Destructure error from fieldState
									) => (
										<TextField
											{...field}
											label={t('HEIGHT')}
											type="number"
											fullWidth
											// Add error handling props
											error={!!error}
											helperText={error?.message}
											// When coercing, an empty string becomes 0, which isn't positive.
											// It's better to treat an empty field as null.
											onChange={(e) => {
												const { value } = e.target;
												field.onChange(value === '' ? null : value);
											}}
											value={field.value ?? ''} // Ensure value is not null for the input
										/>
									)}
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCloseDialog}>{t('CANCEL')}</Button>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isLoading}
							>
								{isLoading ? <CircularProgress size={24} /> : t('START_PROCESSING')}
							</Button>
						</DialogActions>
					</form>
				</FormProvider>
			</Dialog>
			<div className="mt-32">
				<MaterialGridDisplay />
			</div>
		</div>
	);
}

export default GlassCuttingPage;
