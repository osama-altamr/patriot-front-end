import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Paper, Typography, Box, Tooltip, Stack, Icon, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import localeString from 'src/app/main/utils/localeString';
import {
	useGetMaterialGridQuery,
	useCreateOrderItemActionMutation,
	useUpdateOrderItemStageMutation,
	useDeleteCuttingResultsMutation
} from '../../OperationsApi';

const colors = [
	'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)', // Indigo
	'linear-gradient(135deg, #ef5350 0%, #e53935 100%)', // Red
	'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)', // Green
	'linear-gradient(135deg, #ffca28 0%, #ffb300 100%)', // Amber
	'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)', // Purple
	'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)', // Cyan
	'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)' // Orange
];
const AXIS_COLOR = '#757575';
const AXIS_THICKNESS = 35;

const calculateAxisStep = (length: number): number => {
	if (length <= 0) return 100;

	const targetTicks = 8;
	const roughStep = length / targetTicks;
	const powerOf10 = 10 ** Math.floor(Math.log10(roughStep));
	const normalizedStep = roughStep / powerOf10;
	let niceStep: number;

	if (normalizedStep < 1.5) niceStep = 1;
	else if (normalizedStep < 3) niceStep = 2;
	else if (normalizedStep < 7) niceStep = 5;
	else niceStep = 10;

	return niceStep * powerOf10;
};

function AxisTicks({ length, scale, isVertical = false }) {
	const step = calculateAxisStep(length);
	const ticks = new Set<number>();
	for (let i = 0; i <= length; i += step) {
		ticks.add(i);
	}
	ticks.add(length);

	return (
		<>
			{Array.from(ticks)
				.sort((a, b) => a - b)
				.map((tick) => (
					<Box
						key={tick}
						sx={{
							position: 'absolute',
							...(isVertical
								? { bottom: tick * scale, left: 0, width: '100%', height: '1px' }
								: { left: tick * scale, top: 0, height: '100%', width: '1px' }),
							backgroundColor: AXIS_COLOR,
							opacity: 0.3
						}}
					>
						<Typography
							variant="caption"
							sx={{
								position: 'absolute',
								color: AXIS_COLOR,
								...(isVertical ? { bottom: -8, left: 5 } : { left: 2, top: 2 })
							}}
						>
							{Math.round(tick)}
						</Typography>
					</Box>
				))}
		</>
	);
}

function MaterialGridDisplay() {
	const { t } = useTranslation('operationsApp');
	const containerRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();
	const user = useAppSelector(selectUser);

	const [scale, setScale] = useState(0);
	const [hasBeenStarted, setHasBeenStarted] = useState(false);

	const { data, error, isLoading, isFetching } = useGetMaterialGridQuery();
	const [createAction, { isLoading: isCreatingAction }] = useCreateOrderItemActionMutation();
	const [updateStage, { isLoading: isUpdatingStage }] = useUpdateOrderItemStageMutation();
	const [deleteResults, { isLoading: isDeleting }] = useDeleteCuttingResultsMutation();

	const isProcessing = isCreatingAction || isUpdatingStage;

	useEffect(() => {
		const calculateScale = () => {
			if (data?.materialDimensions && containerRef.current && containerRef.current.offsetWidth > 0) {
				const widthNum = parseFloat(data.materialDimensions.width);
				const heightNum = parseFloat(data.materialDimensions.height);

				if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
					setScale(0);
					return;
				}

				const availableWidth = containerRef.current.offsetWidth - AXIS_THICKNESS - 48;
				const availableHeight = window.innerHeight * 0.6;
				const scaleX = availableWidth / widthNum;
				const scaleY = availableHeight / heightNum;
				setScale(Math.min(scaleX, scaleY));
			} else {
				setScale(0);
			}
		};
		calculateScale();
		window.addEventListener('resize', calculateScale);
		return () => window.removeEventListener('resize', calculateScale);
	}, [data, isFetching]);

	useEffect(() => {
		if (data?.packedItems && data.packedItems.length > 0) {
			const anyItemHasActions = data.packedItems.some(
				(item) => item.item?.orderItemActions && item.item.orderItemActions.length > 0
			);
			setHasBeenStarted(anyItemHasActions);
		} else {
			setHasBeenStarted(false);
		}
	}, [data]);

	const handleStartCuttingSheet = async () => {
		if (!data?.packedItems?.length) return;

		try {
			const createActionPromises = data.packedItems.map((item) =>
				createAction({ itemId: item.id, isStart: true }).unwrap()
			);
			const updateStatusPromises = data.packedItems.map((item) =>
				updateStage({ itemId: item.id, status: 'inProgress' }).unwrap()
			);
			await Promise.all([...createActionPromises, ...updateStatusPromises]);

			dispatch(showMessage({ message: t('ALL_ITEMS_STARTED_SUCCESSFULLY'), variant: 'success' }));
		} catch (err) {
			dispatch(showMessage({ message: t('ERROR_STARTING_CUTTING'), variant: 'error' }));
		}
	};

	const handleEndCuttingSheet = async () => {
		if (!data?.packedItems?.length) return;

		try {
			const createActionPromises = data.packedItems.map((packedItem) =>
				createAction({ itemId: packedItem.id, isStart: false }).unwrap()
			);
			const updateStagePromises = data.packedItems.map((packedItem) => {
				const { item } = packedItem;
				const currentStageId = item.currentStage?.id;
				console.log(currentStageId);
				const stagesArray = item.stages || [];
				const currentIndex = stagesArray.findIndex((stage) => stage.id === currentStageId);
				console.log(currentIndex);
				console.log(currentStageId);
				console.log(stagesArray);
				console.log(stagesArray.length);
				let payload: any;

				if (currentIndex !== -1 && currentIndex < stagesArray.length - 1) {
					const nextStageId = stagesArray[currentIndex + 1].id
					payload = { itemId: item.id, currentStageId: nextStageId };
					console.log(nextStageId)
				} else {
					payload = { itemId: item.id, status: 'completed' };
				}

				return updateStage(payload).unwrap();
			});
			await Promise.all([...createActionPromises, ...updateStagePromises]);

			await deleteResults().unwrap();
			dispatch(showMessage({ message: t('CUTTING_COMPLETED_SUCCESSFULLY'), variant: 'success' }));
		} catch (err) {
			dispatch(showMessage({ message: t('ERROR_COMPLETING_STAGES'), variant: 'error' }));
		}
	};

	const isCurrentlyFetching = isLoading || (isFetching && !isProcessing);
	const materialDimensions = data?.materialDimensions;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-96">
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return <Typography color="error">{t('FAILED_TO_LOAD_GRID')}</Typography>;
	}

	return (
		<Paper
			ref={containerRef}
			className="p-24 w-full"
			sx={{ minHeight: 400 }}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				mb={2}
			>
				<Stack>
					<Typography variant="h6">{t('MATERIAL_OPTIMIZATION_GRID')}</Typography>
					{materialDimensions && (
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{t('SHEET_DIMENSIONS')}: {materialDimensions.width} x {materialDimensions.height}
						</Typography>
					)}
				</Stack>
				<Stack
					direction="row"
					alignItems="center"
					spacing={2}
				>
					{data?.utilization && (
						<Typography
							variant="subtitle1"
							sx={{ fontWeight: 'bold' }}
						>
							{t('UTILIZATION')}: {(data.utilization * 100).toFixed(2)}%
						</Typography>
					)}

					{data?.packedItems && data.packedItems.length > 0 && (
						<>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleStartCuttingSheet}
								// --- THE FIX: Disable the button if it has been started OR if processing ---
								disabled={hasBeenStarted || isProcessing}
								startIcon={
									isProcessing ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<Icon>content_cut</Icon>
									)
								}
							>
								{t('START_CUTTING_SHEET')}
							</Button>
							<Button
								variant="contained"
								color="success"
								onClick={handleEndCuttingSheet}
								// --- THE FIX: Disable the button if it has NOT been started OR if processing ---
								disabled={!hasBeenStarted || isProcessing}
								startIcon={
									isProcessing ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : (
										<Icon>check_circle</Icon>
									)
								}
							>
								{t('END_CUTTING_SHEET')}
							</Button>
						</>
					)}
					{isCurrentlyFetching && <CircularProgress size={20} />}
				</Stack>
			</Stack>

			{data?.packedItems?.length > 0 && materialDimensions && scale > 0 ? (
				<Box sx={{ display: 'flex', mt: 2 }}>
					<Box
						sx={{
							width: AXIS_THICKNESS,
							height: parseFloat(materialDimensions.height) * scale,
							position: 'relative',
							mr: 1
						}}
					>
						<AxisTicks
							length={parseFloat(materialDimensions.height)}
							scale={scale}
							isVertical
						/>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Box
							sx={{
								height: AXIS_THICKNESS,
								width: parseFloat(materialDimensions.width) * scale,
								position: 'relative',
								mb: 1
							}}
						>
							<AxisTicks
								length={parseFloat(materialDimensions.width)}
								scale={scale}
							/>
						</Box>
						<Box
							sx={{
								position: 'relative',
								width: parseFloat(materialDimensions.width) * scale,
								height: parseFloat(materialDimensions.height) * scale,
								border: `1px solid ${AXIS_COLOR}`,
								backgroundColor: '#fafafa',
								boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
							}}
						>
							{data.packedItems.map((item, index) => (
								<Tooltip
									key={item.id}
									title={
										<div>
											<Typography
												variant="body2"
												sx={{ fontWeight: 'bold' }}
											>
												{localeString(item.item?.product?.name)}
											</Typography>
											<Typography variant="caption">
												{t('DIMENSIONS')}: {item.width} x {item.height}
											</Typography>
											<br />
											<Typography variant="caption">
												{t('POSITION')}: ({item.x}, {item.y})
											</Typography>
											<br />
											<Typography variant="caption">
											{t('ID')}: {item.id}
											</Typography>
										</div>
									}
									placement="top"
									arrow
								>
									<Box
										component={motion.div}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: index * 0.05,
											type: 'spring',
											stiffness: 300,
											damping: 20
										}}
										sx={{
											position: 'absolute',
											boxSizing: 'border-box',
											left: item.x * scale,
											bottom: item.y * scale,
											width: item.width * scale,
											height: item.height * scale,
											background: colors[index % colors.length],
											border: '1px solid rgba(255, 255, 255, 0.7)',
											boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											overflow: 'hidden',
											cursor: 'pointer',
											borderRadius: '4px'
										}}
									>
										{item.width * scale > 60 && (
											<Typography
												variant="caption"
												sx={{
													color: 'white',
													fontWeight: 'bold',
													textShadow: '1px 1px 2px black'
												}}
											>
												{item.width}x{item.height}
											</Typography>
										)}
									</Box>
								</Tooltip>
							))}
						</Box>
					</Box>
				</Box>
			) : (
				<Box className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500">
					<Icon>{isCurrentlyFetching ? 'hourglass_empty' : 'grid_off'}</Icon>
					<Typography sx={{ mt: 2 }}>
						{isCurrentlyFetching ? t('LOADING_RESULTS') : t('NO_ITEMS_TO_PROCESS')}
					</Typography>
				</Box>
			)}
		</Paper>
	);
}

export default MaterialGridDisplay;
