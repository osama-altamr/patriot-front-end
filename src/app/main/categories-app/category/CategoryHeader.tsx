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
import ICategory from '../models/ICategory';
import { useCreateCategoryMutation, useRemoveCategoryMutation, useUpdateCategoryMutation } from '../CategoriesApi';
import { employeeScopes } from '../../employees-app/Utils';

/**
 * The category header.
 */
function CategoryHeader() {
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const routeParams = useParams();
	const { categoryId } = routeParams;
	const { t } = useTranslation('categoriesApp');
	const [loading, setLoading] = useState(false);
	const [loadingRemove, setLoadingRemove] = useState(false);
	const [loadingActivate, setLoadingActivate] = useState(false);
	const [loadingDeactivate, setLoadingDeactivate] = useState(false);

	const [updateCategory] = useUpdateCategoryMutation();
	const [createCategory] = useCreateCategoryMutation();
	const [removeCategory] = useRemoveCategoryMutation();
	const methods = useFormContext<ICategory>();
	const { formState, watch, handleSubmit, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();
	const { id, name, active } = watch();

	function optimizeCategory(data: ICategory) {
		const categoryData = { ...data };
		delete categoryData.createdAt;
		delete categoryData.updatedAt;
		return categoryData;
	}

	function handleSaveCategory() {
		const onSubmit = (data: ICategory) => {
			setLoading(true);
			(id && id !== 'new' ? updateCategory : createCategory)(optimizeCategory(getValues()))
				.unwrap()
				.then(() => {
					setLoading(false);
					dispatch(
						showMessage({
							message: t(`CATEGORY_SAVED_SUCCESSFULLY`),
							variant: 'success',
							autoHideDuration: 2000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'right'
							}
						})
					);
					navigate(`/categories`);
				})
				.catch((e) => {
					setLoading(false);
					dispatch(
						showMessage({
							message: t(`SOMETHING_WENT_WRONG_WHEN_SAVE_CATEGORY`),
							variant: 'error',
							autoHideDuration: 2000,
							anchorOrigin: {
								vertical: 'top',
								horizontal: 'right'
							}
						})
					);
				});
		};
		handleSubmit(onSubmit)();
	}

	function handleRemoveCategory() {
		dispatch(
			openDialog({
				children: (
					<AlertDialog
						title={t(`REMOVE_CATEGORY_TITLE`)}
						message={t(`REMOVE_CATEGORY_MESSAGE`)}
						onSubmit={() => {
							setLoadingRemove(true);
							removeCategory(categoryId)
								.unwrap()
								.then((action) => {
									setLoadingRemove(false);
									dispatch(
										showMessage({
											message: t(`CATEGORY_REMOVED_SUCCESSFULLY`),
											variant: 'success',
											autoHideDuration: 2000,
											anchorOrigin: {
												vertical: 'top',
												horizontal: 'right'
											}
										})
									);
									navigate(`/categories`);
								})
								.catch((e) => {
									setLoadingRemove(false);
									dispatch(
										showMessage({
											message: t(`SOMETHING_WENT_WRONG_WHEN_REMOVE_CATEGORY`),
											variant: 'error',
											autoHideDuration: 2000,
											anchorOrigin: {
												vertical: 'top',
												horizontal: 'right'
											}
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
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/categories"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">{t(`CATEGORIES`)}</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{t(`CATEGORY_DETAILS`)}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							{name ? `${localeString(name) ?? ''}` : t(`CATEGORY`)}
						</Typography>
					</motion.div>
				</div>
			</div>

			{(id && id !== 'new') ||
				(FuseUtils.hasOperationPermission(employeeScopes.categories, 'update', user) && (
					<motion.div
						className="flex flex-1 w-full"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<LoadingButton
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="error"
							onClick={handleRemoveCategory}
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
							<span>{t(`REMOVE_CATEGORY`)}</span>
						</LoadingButton>
					</motion.div>
				))}

			{(!id || id === 'new' || FuseUtils.hasOperationPermission(employeeScopes.categories, 'update', user)) && (
				<motion.div
					className="flex flex-1 w-full"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					<LoadingButton
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						onClick={handleSaveCategory}
						startIcon={
							<Icon
								type="fa6"
								name="FaFloppyDisk"
								size="0.8em"
							/>
						}
						loadingPosition="start"
						loading={loading}
						disabled={id && id !== 'new' && (_.isEmpty(dirtyFields) || !isValid)}
					>
						<span>{t(`${id && id !== 'new' ? 'SAVE' : 'CREATE'}_CATEGORY`)}</span>
					</LoadingButton>
				</motion.div>
			)}
		</div>
	);
}

export default CategoryHeader;
