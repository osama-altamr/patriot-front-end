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
import { Button } from '@mui/material';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import FuseUtils from '@fuse/utils';
import { employeeScopes } from '../../employees-app/Utils';
import IReport from '../models/IReport';
import { useCreateReportMutation, useRemoveReportMutation, useUpdateReportMutation } from '../ReportsApi';

/**
 * The report header.
 */
function ReportHeader() {
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const { reportId } = routeParams;
	const { t } = useTranslation('reportsApp');
	const [loading, setLoading] = useState(false);
	const [loadingRemove, setLoadingRemove] = useState(false);

	const [updateReport] = useUpdateReportMutation();
	const [createReport] = useCreateReportMutation();
	const [removeReport] = useRemoveReportMutation();
	const methods = useFormContext<IReport>();
	const { formState, watch, handleSubmit, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();
	const { id, name, xlsxUrl } = watch();

	function optimizeReport(data: IReport) {
		const reportData = { ...data };
		delete reportData.createdAt;
		delete reportData.updatedAt;
		// ... any other fields to exclude from save/update
		return reportData;
	}

	function handleSaveReport() {
		const onSubmit = () => {
			setLoading(true);
			(id && id !== 'new' ? updateReport : createReport)(optimizeReport(getValues()))
				.unwrap()
				.then(() => {
					setLoading(false);
					dispatch(showMessage({ message: t(`REPORT_SAVED_SUCCESSFULLY`), variant: 'success' }));
					navigate(`/reports`);
				})
				.catch(() => {
					setLoading(false);
					dispatch(showMessage({ message: t(`SOMETHING_WENT_WRONG_WHEN_SAVE_REPORT`), variant: 'error' }));
				});
		};
		handleSubmit(onSubmit)();
	}

	function handleRemoveReport() {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t(`REMOVE_REPORT_TITLE`)}
						message={t(`REMOVE_REPORT_MESSAGE`)}
						onSubmit={() => {
							setLoadingRemove(true);
							removeReport(reportId)
								.unwrap()
								.then(() => {
									setLoadingRemove(false);
									dispatch(showMessage({ message: t(`REPORT_REMOVED_SUCCESSFULLY`), variant: 'success' }));
									navigate(`/reports`);
								})
								.catch(() => {
									setLoadingRemove(false);
									dispatch(
										showMessage({ message: t(`SOMETHING_WENT_WRONG_WHEN_REMOVE_REPORT`), variant: 'error' })
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
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/reports"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">{t(`REPORTS`)}</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{' '}
							{t(`REPORT_DETAILS`)}{' '}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{' '}
							{name ? `${localeString(name) ?? ''}` : t(`REPORT`)}{' '}
						</Typography>
					</motion.div>
				</div>
			</div>

			<div className="flex items-center justify-end space-x-8">
				{id && id !== 'new' && xlsxUrl && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="success"
							component="a"
							href={xlsxUrl}
							target="_blank"
							rel="noopener noreferrer"
							startIcon={<Icon type="fa6" name="FaFileExcel" size="0.8em" />}
						>
							<span>{t(`DOWNLOAD_EXCEL`)}</span>
						</Button>
					</motion.div>
				)}

				{id && id !== 'new' && FuseUtils.hasOperationPermission(employeeScopes.reports, 'update', user) && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<LoadingButton
							className="whitespace-nowrap"
							variant="contained"
							color="error"
							onClick={handleRemoveReport}
							startIcon={<Icon type="fa6" name="FaRegTrashCan" size="0.8em" />}
							loadingPosition="start"
							loading={loadingRemove}
						>
							<span>{t(`REMOVE_REPORT`)}</span>
						</LoadingButton>
					</motion.div>
				)}

				{(!id || id === 'new' || FuseUtils.hasOperationPermission(employeeScopes.reports, 'update', user)) && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<LoadingButton
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							onClick={handleSaveReport}
							startIcon={<Icon type="fa6" name="FaFloppyDisk" size="0.8em" />}
							loadingPosition="start"
							loading={loading}
							disabled={(id && id !== 'new' && (_.isEmpty(dirtyFields) || !isValid)) || !isValid}
						>
							<span>{t(`${id && id !== 'new' ? 'SAVE' : 'CREATE'}_REPORT`)}</span>
						</LoadingButton>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default ReportHeader;