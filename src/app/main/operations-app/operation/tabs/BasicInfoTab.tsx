import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Grid, Card, CardMedia, CardContent, Button, Icon, CircularProgress, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import localeString from 'src/app/main/utils/localeString';
import { useNavigate } from 'react-router';
import IOperation from '../../models/IOperation';
import { useCreateOrderItemActionMutation, useUpdateOrderItemStageMutation } from '../../OperationsApi';

function BasicInfoTab({ operation }: { operation?: IOperation }) {
	const { t } = useTranslation('operationsApp');
	const dispatch = useDispatch();
	const user = useAppSelector(selectUser);
	const navigate = useNavigate();
	// State to determine which buttons to show/disable
	const [hasBeenStarted, setHasBeenStarted] = useState(false);

	const [createAction, { isLoading: isCreatingAction }] = useCreateOrderItemActionMutation();
	const [updateStage, { isLoading: isUpdatingStage }] = useUpdateOrderItemStageMutation();

	const isProcessing = isCreatingAction || isUpdatingStage;

	useEffect(() => {
		if (operation) {
			const userStageId = user.permissions?.stage?.id;
			const hasMatchingAction = operation.orderItemActions?.some((action) => action.stage?.id === userStageId);
			setHasBeenStarted(!!hasMatchingAction);
		}
	}, [operation, user.permissions?.stage?.id]);

	const handleStart = async () => {
		if (!operation) return;

		try {
			await createAction({ itemId: operation.id, isStart: true }).unwrap();
			await updateStage({ itemId: operation.id, status: 'inProgress' }).unwrap();
			dispatch(showMessage({ message: t('OPERATION_STARTED_SUCCESSFULLY'), variant: 'success' }));
		} catch (err) {
			dispatch(showMessage({ message: t('ERROR_STARTING_OPERATION'), variant: 'error' }));
		}
	};

	const handleEnd = async () => {
		if (!operation) return;

		try {
			await createAction({ itemId: operation.id, isStart: false }).unwrap();

			const currentStageId = operation.currentStage?.id;
			const stagesArray = operation.stages || [];
			const currentIndex = stagesArray.findIndex((stage) => stage.id === currentStageId);

			let payload: any;

			if (currentIndex !== -1 && currentIndex < stagesArray.length - 1) {
				const nextStageId = stagesArray[currentIndex + 1].id;
				payload = { itemId: operation.id, currentStageId: nextStageId };
			} else {
				payload = { itemId: operation.id, currentStageId: null, status: 'completed' };
			}

			await updateStage(payload).unwrap();
			dispatch(showMessage({ message: t('OPERATION_ENDED_SUCCESSFULLY'), variant: 'success' }));
			navigate('/operations');
		} catch (err) {
			dispatch(showMessage({ message: t('ERROR_ENDING_OPERATION'), variant: 'error' }));
		}
	};

	if (!operation) {
		return <CircularProgress />;
	}

	const designTitle = operation.stagePattern 
	? localeString(operation.stagePattern.title) 
	: t('CUSTOM_DESIGN');

	const designImageUrl = operation.stagePattern 
		? operation.stagePattern.imageUrl 
		: operation.patternImageUrl 

	return (
		<div className="p-16">
			<Stack
				direction="row"
				spacing={2}
				justifyContent="flex-end"
				mb={3}
			>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleStart}
					disabled={hasBeenStarted || isProcessing}
					startIcon={
						isProcessing ? (
							<CircularProgress
								size={20}
								color="inherit"
							/>
						) : (
							<Icon>play_arrow</Icon>
						)
					}
				>
					{t('START')}
				</Button>
				<Button
					variant="contained"
					color="success"
					onClick={handleEnd}
					disabled={!hasBeenStarted || isProcessing}
					startIcon={
						isProcessing ? (
							<CircularProgress
								size={20}
								color="inherit"
							/>
						) : (
							<Icon>stop</Icon>
						)
					}
				>
					{t('END')}
				</Button>
			</Stack>

			{designImageUrl && (
				<Card className="mb-16">
					<Box
						component="div"
						className="py-8 px-16"
						sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1) }}
					>
						<Typography className="text-17 font-bold">{t('DESIGN_INFORMATION')}</Typography>
					</Box>
					<CardContent className="flex flex-col md:flex-row items-center gap-16">
						<CardMedia
							component="img"
							image={designImageUrl}
							alt={designTitle}
							sx={{
								width: 150,
								height: 150,
								objectFit: 'contain',
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: '8px'
							}}
						/>
						<Box>
							<Typography variant="h6" fontWeight="bold">
								{t('PATTERN_TITLE')}:
							</Typography>
							<Typography>{designTitle}</Typography>
						</Box>
					</CardContent>
				</Card>
			)}


			{/* Main Information Card */}
			<Card>
				<Box
					component="div"
					className="py-8 px-16"
					sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
				>
					<Typography className="text-17 font-bold">{t('MAIN_INFORMATION')}</Typography>
				</Box>
				<CardContent>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('PRODUCT')}:
							</Typography>
							<Typography>{localeString(operation.product?.name)}</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('STATUS')}:
							</Typography>
							<Typography>{operation.status}</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('WIDTH')}:
							</Typography>
							<Typography>{operation.width}</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('HEIGHT')}:
							</Typography>
							<Typography>{operation.height}</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('CURRENT_STAGE')}:
							</Typography>
							<Typography>{localeString(operation.currentStage?.name)}</Typography>
						</Grid>
						<Grid
							item
							xs={12}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('NOTE')}:
							</Typography>
							<Typography>{operation.note || t('NO_NOTE_PROVIDED')}</Typography>
						</Grid>
						<Grid
							item
							xs={12}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('ID')}:
							</Typography>
							<Typography>{operation.id || t('NO_ID_PROVIDED')}</Typography>
						</Grid>
						<Grid
							item
							xs={12}
						>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
							>
								{t('FULL_WORKFLOW')}:
							</Typography>
							<Typography>
								{operation.stages?.map((stage) => localeString(stage.name)).join(' → ') || 'N/A'}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</div>
	);
}

export default BasicInfoTab;
