import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
	requiredStringValidation,
	optionalStringValidation,
	optionalDateTimeValidation
} from 'src/app/main/utils/validations';
import { useAppDispatch } from 'app/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import OrderHeader from './OrderHeader';
import { useGetOrderQuery, useUpdateOrderMutation } from '../OrdersApi';
import { orderDefaultValues } from '../models/OrderModel';
import IOrder from '../models/IOrder';
import BasicInfoTab from './tabs/BasicInfoTab';
import ItemsTab from './tabs/ItemsTab';

function Order() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('ordersApp');
	const { orderId } = useParams();
	const dispatch = useAppDispatch();

	const [tabValue, setTabValue] = useState(0);

	const schema = z.object({
		total: z.coerce.number({ invalid_type_error: 'Total must be a number' }).positive('Total must be a positive number').optional(),
		priority: optionalStringValidation(),
		note: optionalStringValidation(),
		ref: optionalStringValidation(),
		status: optionalStringValidation(),
		outForDeliveryAt: optionalDateTimeValidation().nullable(),
		deliveredAt: optionalDateTimeValidation().nullable(),
		userId: requiredStringValidation(),
		driverId: optionalStringValidation().nullable(),
		address: z.object({
			stateId: requiredStringValidation(),
			cityId: requiredStringValidation(),
			street1: requiredStringValidation(),
			street2: optionalStringValidation(),
			postalCode: optionalStringValidation(),
			apartment: optionalStringValidation(),
			complex: optionalStringValidation()
		}),
		items: z
			.array(
				z.object({
					productId: requiredStringValidation(),
					materialId: z.string().optional().nullable(),
					width: z.coerce.number(),
					height: z.coerce.number(),
					note: optionalStringValidation(),
					id: z.string().optional(),
					status: z.string().optional(),
					qrCode: z.string().optional()
				})
			)
			.optional()
	});

	// API hooks for fetching and updating data
	const {
		data: order,
		isLoading,
		isError
	} = useGetOrderQuery(orderId, {
		skip: !orderId || orderId === 'new'
	});
	const [updateOrder] = useUpdateOrderMutation();

	// React Hook Form methods
	const methods = useForm<IOrder>({
		mode: 'onChange',
		defaultValues: orderDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, getValues } = methods;

	// Effect to reset the form when the order data loads or changes
	useEffect(() => {
		if (order) {
			reset({ ...order });
		} else if (orderId === 'new') {
			reset(orderDefaultValues);
		}
	}, [order, reset, orderId]);

	/**
	 * FIX: This function performs the driver assignment mutation.
	 * It is defined here in the parent and passed down as a prop.
	 */
  const handleAssignDriver = (driverId: string) => {
		const currentOrderId = getValues('id');
    console.log(driverId)
		if (!currentOrderId) return;

		const payload = {
			id: currentOrderId,
			driverId: driverId,
		};

		updateOrder(payload)
			.unwrap()
			.then(() => {
				dispatch(showMessage({ message: t('DRIVER_ASSIGNED_SUCCESSFULLY'), variant: 'success' }));
			})
			.catch((error) => {
				dispatch(
					showMessage({ message: error?.data?.message || t('ERROR_ASSIGNING_DRIVER'), variant: 'error' })
				);
			});
	};
	if (isLoading || (orderId !== 'new' && !order && !isError)) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					{t('NO_ORDER')}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/orders"
					color="inherit"
				>
					{t('GO_TO_ORDERS')}
				</Button>
			</motion.div>
		);
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		// The FormProvider makes the form methods available to all nested components
		<FormProvider {...methods}>
			<FusePageCarded
				header={<OrderHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label={t('BASIC_INFO')}
							/>
							<Tab
								className="h-64"
								label={t('ITEMS')}
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-6xl mx-auto w-full">
							{tabValue === 0 && (
								<BasicInfoTab
									order={order}
									onAssignDriver={handleAssignDriver}
								/>
							)}
							{tabValue === 1 && <ItemsTab order={order} />}
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Order;
