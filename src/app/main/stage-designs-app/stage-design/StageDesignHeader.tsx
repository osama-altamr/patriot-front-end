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
import localeString from 'src/app/main/utils/localeString';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import FuseUtils from '@fuse/utils';
import IStageDesign from '../models/IStageDesign'; // Make sure you have this interface
import {
	useCreateStageDesignMutation,
	useRemoveStageDesignMutation,
	useUpdateStageDesignMutation
} from '../StageDesignsApi'; // Import your StageDesign API hooks
import { employeeScopes } from '../../employees-app/Utils';

/**
 * The header for the single Stage Design page.
 */
function StageDesignHeader() {
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const { stageDesignId } = useParams(); // Use a consistent name like `stageDesignId`
	const { t } = useTranslation('stageDesignsApp');
	const [loading, setLoading] = useState(false);
	const [loadingRemove, setLoadingRemove] = useState(false);

	// Use the mutations for Stage Designs
	const [updateStageDesign] = useUpdateStageDesignMutation();
	const [createStageDesign] = useCreateStageDesignMutation();
	const [removeStageDesign] = useRemoveStageDesignMutation();

	const methods = useFormContext<IStageDesign>();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();
	const { id, title } = watch(); // Watch the `title` field for the header

	// This function can be simplified as we are likely sending the whole object
	function handleSaveStageDesign() {
		const data = getValues();
		setLoading(true);
		(id && id !== 'new' ? updateStageDesign(data) : createStageDesign(data))
			.unwrap()
			.then(() => {
				setLoading(false);
				dispatch(
					showMessage({
						message: t(`STAGE_DESIGN_SAVED_SUCCESSFULLY`),
						variant: 'success'
					})
				);
				navigate(`/stage-designs`);
			})
			.catch(() => {
				setLoading(false);
				dispatch(
					showMessage({
						message: t(`ERROR_SAVING_STAGE_DESIGN`),
						variant: 'error'
					})
				);
			});
	}

	function handleRemoveStageDesign() {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t(`REMOVE_STAGE_DESIGN_TITLE`)}
						message={t(`REMOVE_STAGE_DESIGN_MESSAGE`)}
						onSubmit={() => {
							setLoadingRemove(true);
							removeStageDesign(stageDesignId)
								.unwrap()
								.then(() => {
									setLoadingRemove(false);
									dispatch(
										showMessage({
											message: t(`STAGE_DESIGN_REMOVED_SUCCESSFULLY`),
											variant: 'success'
										})
									);
									navigate(`/stage-designs`);
								})
								.catch(() => {
									setLoadingRemove(false);
									dispatch(
										showMessage({
											message: t(`ERROR_REMOVING_STAGE_DESIGN`),
											variant: 'error'
										})
									);
								});
						}}
					/>
				)
			})
		);
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				{/* --- Back Link --- */}
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/stage-designs" // Link back to the list page
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">{t(`STAGE_DESIGNS`)}</span>
					</Typography>
				</motion.div>

				{/* --- Title --- */}
				<div className="flex items-center max-w-full">
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{t(`STAGE_DESIGN_DETAILS`)}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{title ? `${localeString(title) ?? ''}` : t(`NEW_STAGE_DESIGN`)}
						</Typography>
					</motion.div>
				</div>
			</div>
            
            {/* --- Action Buttons --- */}
			<div className="flex items-center justify-end space-x-8">
				{id && id !== 'new' && FuseUtils.hasOperationPermission(employeeScopes.stages, 'delete', user) && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<LoadingButton
							className="whitespace-nowrap"
							variant="contained"
							color="error"
							onClick={handleRemoveStageDesign}
							startIcon={<Icon>delete</Icon>}
							loading={loadingRemove}
							loadingPosition="start"
						>
							<span>{t(`REMOVE`)}</span>
						</LoadingButton>
					</motion.div>
				)}

				{(!id || id === 'new' || FuseUtils.hasOperationPermission(employeeScopes.stages, 'update', user)) && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<LoadingButton
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							onClick={handleSaveStageDesign}
							startIcon={<Icon>save</Icon>}
							loading={loading}
							loadingPosition="start"
							disabled={id && id !== 'new' && (_.isEmpty(dirtyFields) || !isValid)}
						>
							<span>{t(`${id && id !== 'new' ? 'SAVE' : 'CREATE'}_STAGE_DESIGN`)}</span>
						</LoadingButton>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default StageDesignHeader;