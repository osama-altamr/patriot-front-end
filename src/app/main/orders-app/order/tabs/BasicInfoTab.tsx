import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, TextField, MenuItem, Typography, alpha, Button, Chip, InputAdornment } from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IOrder from '../../models/IOrder';
import { orderPriority, toOrderPriorityTitle, orderStatus, toOrderStatusTitle } from '../../Utils';
import AssignDriverDialog from './AssignDriverDialog';

// This interface defines the props the component expects from its parent (Order.tsx)
interface BasicInfoTabProps {
	order?: IOrder;
	onAssignDriver: (driverId: string) => void;
}

function BasicInfoTab({ order, onAssignDriver }: BasicInfoTabProps) {
	const { t } = useTranslation('ordersApp');
	const {
		control,
		formState: { errors },
		watch
	} = useFormContext<IOrder>();

	// Watch form fields to dynamically update the UI
	const status = watch('status');
	const driver = watch('driver'); // Watch the full driver object
	const selectedStateId = watch('address.stateId');

	// State to control the visibility of the driver assignment dialog
	const [isAssignDriverDialogOpen, setAssignDriverDialogOpen] = useState(false);

	/**
	 * This function is called when a driver is selected in the dialog.
	 * It then calls the `onAssignDriver` function that was passed down from the parent.
	 */
	const handleAssign = (driverId: string) => {
		onAssignDriver(driverId);
	};

	return (
		<>
			<div>
				<Box
					component="div"
					className="py-8 px-16 my-16 w-full rounded-lg"
					sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
				>
					<Typography className="text-17 font-bold">{t('MAIN_INFORMATION')}</Typography>
				</Box>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
					<Controller
						name="ref"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('REF')}
								variant="outlined"
								fullWidth
								disabled
							/>
						)}
					/>
					<Controller
						name="total"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('TOTAL')}
								variant="outlined"
								fullWidth
								disabled
							/>
						)}
					/>
					<Controller
						name="priority"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.priority}
								helperText={errors?.priority?.message}
								label={t('PRIORITY')}
								select
								variant="outlined"
								fullWidth
							>
								{Object.values(orderPriority).map((value) => (
									<MenuItem
										key={value}
										value={value}
									>
										{t(toOrderPriorityTitle(value))}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.status}
								helperText={errors?.status?.message}
								label={t('STATUS')}
								select
								variant="outlined"
								fullWidth
							>
								{Object.values(orderStatus).map((value) => (
									<MenuItem
										key={value}
										value={value}
									>
										{t(toOrderStatusTitle(value))}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="note"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="sm:col-span-2"
								error={!!errors.note}
								helperText={errors?.note?.message}
								label={t('NOTE')}
								variant="outlined"
								fullWidth
								multiline
								rows={3}
							/>
						)}
					/>
					<Controller
						name="userId"
						control={control}
						render={({ field }) => (
							<CustomAutoComplete
								{...field}
								label={t('USER')}
								placeholder={t('SELECT_SINGLE_USER')}
								getItemUrl="v1/users?role=user"
								getItemsUrl="v1/users?role=user"
								defaultItem={order?.user}
								error={!!errors.userId}
								getOptionLabel={(option: any) => option.name || ''}
								helperText={errors?.userId?.message}
								required
							/>
						)}
					/>
					<Controller
						name="outForDeliveryAt"
						control={control}
						render={({ field: { onChange, value } }) => (
							<DatePicker
								label={t('OUT_FOR_DELIVERY_AT')}
								value={value ? new Date(value) : null}
								onChange={(date) => onChange(date?.toISOString() || null)}
								disabled
								slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
								format="dd/MM/yyyy"
							/>
						)}
					/>
					<Controller
						name="deliveredAt"
						control={control}
						render={({ field: { onChange, value } }) => (
							<DatePicker
								label={t('DELIVERED_AT')}
								value={value ? new Date(value) : null}
								onChange={(date) => onChange(date?.toISOString() || null)}
								disabled
								slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
								format="dd/MM/yyyy"
							/>
						)}
					/>
				</div>

				{/* ==================================================================== */}
				{/* Driver Information Section with Correct Conditional Logic          */}
				{/* ==================================================================== */}
				<Box
					component="div"
					className="py-8 px-16 my-16 w-full rounded-lg"
					sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1) }}
				>
					<Typography className="text-17 font-bold">{t('DRIVER_INFORMATION')}</Typography>
				</Box>
				<div className="p-16">
					{/* FIX: This logic block now perfectly matches your requirement. */}
					{(() => {
						// Case 1: A driver is already assigned. Show their info and a change button.
						if (driver) {
							return (
								<div className="flex items-center gap-16">
									<Chip
										label={
											<Typography>
												Assigned to:{' '}
												<Link
													className="font-semibold text-blue-500 hover:underline"
													to={`/users/${driver.id}`}
												>
													{driver.name}
												</Link>
											</Typography>
										}
										variant="outlined"
									/>
									<Button
										variant="outlined"
										onClick={() => setAssignDriverDialogOpen(true)}
									>
										{t('CHANGE_DRIVER')}
									</Button>
								</div>
							);
						}

						// Case 2: NO driver is assigned, AND the order status is 'completed'. Show the assign button.
						if (status === 'completed') {
							return (
								<Button
									variant="contained"
									color="secondary"
									startIcon={<FuseSvgIcon>heroicons-outline:user-plus</FuseSvgIcon>}
									onClick={() => setAssignDriverDialogOpen(true)}
								>
									{t('ASSIGN_DRIVER')}
								</Button>
							);
						}

						// Case 3 (Fallback): NO driver is assigned and status is NOT 'completed'. Show info text.
						return (
							<Typography color="text.secondary">
								{t('DRIVER_CAN_BE_ASSIGNED_AFTER_ORDER_IS_COMPLETED')}
							</Typography>
						);
					})()}
				</div>

				{/* ==================================================================== */}
				{/* Delivery Address Section (Unchanged)                             */}
				{/* ==================================================================== */}
				<Box
					component="div"
					className="py-8 px-16 my-16 w-full rounded-lg"
					sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
				>
					<Typography className="text-17 font-bold">{t('DELIVERY_ADDRESS')}</Typography>
				</Box>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
					<Controller
						name="address.stateId"
						control={control}
						render={({ field }) => (
							<CustomAutoComplete
								{...field}
								label={t('STATE')}
								placeholder={t('SELECT_SINGLE_STATE')}
								getItemUrl="v1/states"
								getItemsUrl="v1/states"
								defaultItem={order?.address?.state}
								error={!!errors.address?.stateId}
								helperText={errors.address?.stateId?.message}
								required
							/>
						)}
					/>
					<Controller
						name="address.cityId"
						control={control}
						render={({ field }) => (
							<CustomAutoComplete
								{...field}
								key={selectedStateId}
								label={t('CITY')}
								placeholder={t('SELECT_SINGLE_CITY')}
								getItemUrl="v1/cities"
								getItemsUrl={selectedStateId ? `v1/cities?stateId=${selectedStateId}` : 'v1/cities'}
								defaultItem={order?.address?.city}
								error={!!errors.address?.cityId}
								helperText={errors.address?.cityId?.message}
								required
								disabled={!selectedStateId}
							/>
						)}
					/>
					<Controller
						name="address.street1"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('STREET_1')}
								variant="outlined"
								fullWidth
								required
								error={!!errors.address?.street1}
								helperText={errors.address?.street1?.message}
							/>
						)}
					/>
					<Controller
						name="address.street2"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('STREET_2')}
								variant="outlined"
								fullWidth
								error={!!errors.address?.street2}
								helperText={errors.address?.street2?.message}
							/>
						)}
					/>
					<Controller
						name="address.postalCode"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('POSTAL_CODE')}
								variant="outlined"
								fullWidth
								error={!!errors.address?.postalCode}
								helperText={errors.address?.postalCode?.message}
							/>
						)}
					/>
					<Controller
						name="address.apartment"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label={t('APARTMENT')}
								variant="outlined"
								fullWidth
								error={!!errors.address?.apartment}
								helperText={errors.address?.apartment?.message}
							/>
						)}
					/>
					<Controller
						name="address.complex"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="sm:col-span-2"
								label={t('COMPLEX_BUILDING')}
								variant="outlined"
								fullWidth
								error={!!errors.address?.complex}
								helperText={errors.address?.complex?.message}
							/>
						)}
					/>
				</div>
			</div>

			{/* The Dialog is rendered here but is only visible when its 'open' state is true */}
			<AssignDriverDialog
				open={isAssignDriverDialogOpen}
				onClose={() => setAssignDriverDialogOpen(false)}
				onAssign={handleAssign}
			/>
		</>
	);
}

export default BasicInfoTab;
