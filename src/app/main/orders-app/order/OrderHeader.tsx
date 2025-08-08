import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import AlertDialog from 'app/shared-components/alert-dialog/AlertDialog';
import { useState } from 'react';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { LoadingButton } from '@mui/lab';
import Icon from 'app/shared-components/Icon';
import { useCreateOrderMutation, useRemoveOrderMutation, useUpdateOrderMutation } from '../OrdersApi';
import IOrder from '../models/IOrder';

function OrderHeader() {
	const dispatch = useDispatch<AppDispatch>();
	const { orderId } = useParams();
	const { t } = useTranslation('ordersApp');
	const [loading, setLoading] = useState(false);
	const [loadingRemove, setLoadingRemove] = useState(false);

	const [updateOrder] = useUpdateOrderMutation();
	const [createOrder] = useCreateOrderMutation();
	const [removeOrder] = useRemoveOrderMutation();
	const navigate = useNavigate();
	const theme = useTheme();

	const { formState, watch, handleSubmit } = useFormContext<IOrder>();
	const { isValid, dirtyFields } = formState;
	const { id, ref } = watch();

	function handleSaveOrder(data: IOrder) {
		setLoading(true);
		const apiCall = id && id !== 'new' ? updateOrder(data) : createOrder(data);

		apiCall
			.unwrap()
			.then(() => {
				dispatch(showMessage({ message: t('ORDER_SAVED_SUCCESSFULLY'), variant: 'success' }));
				navigate('/orders');
			})
			.catch(() => {
				dispatch(showMessage({ message: t('SOMETHING_WENT_WRONG_WHEN_SAVE_ORDER'), variant: 'error' }));
			})
			.finally(() => setLoading(false));
	}

	function handleRemoveOrder() {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t('REMOVE_ORDER_TITLE')}
						message={t('REMOVE_ORDER_MESSAGE')}
						onSubmit={() => {
							setLoadingRemove(true);
							removeOrder(orderId)
								.unwrap()
								.then(() => {
									dispatch(
										showMessage({ message: t('ORDER_REMOVED_SUCCESSFULLY'), variant: 'success' })
									);
									navigate('/orders');
								})
								.catch(() => {
									dispatch(
										showMessage({
											message: t('SOMETHING_WENT_WRONG_WHEN_REMOVE_ORDER'),
											variant: 'error'
										})
									);
								})
								.finally(() => setLoadingRemove(false));
						}}
					/>
				)
			})
		);
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/orders"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">{t('ORDERS')}</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{ref ? `${t('ORDER')}# ${ref}` : t('NEW_ORDER')}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{t('ORDER_DETAILS')}
						</Typography>
					</motion.div>
				</div>
			</div>

			<motion.div
				className="flex"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{id && id !== 'new' && (
					<LoadingButton
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="error"
						onClick={handleRemoveOrder}
						startIcon={
							<Icon
								type="fa6"
								name="FaRegTrashCan"
								size="0.8em"
							/>
						}
						loadingPosition="start"
						loading={loadingRemove}
					>
						{t('REMOVE_ORDER')}
					</LoadingButton>
				)}
				<LoadingButton
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleSubmit(handleSaveOrder)}
					startIcon={
						<Icon
							type="fa6"
							name="FaFloppyDisk"
							size="0.8em"
						/>
					}
					loadingPosition="start"
					loading={loading}
					disabled={_.isEmpty(dirtyFields) || !isValid}
				>
					{t(id && id !== 'new' ? 'SAVE' : 'CREATE')}
				</LoadingButton>
			</motion.div>
		</div>
	);
}

export default OrderHeader;
