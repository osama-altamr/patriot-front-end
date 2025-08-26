import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useTranslation } from 'react-i18next';
import { Input, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import FilterIcon from 'app/shared-components/filter-icon/FilterIcon';
import { FilterTypes } from 'app/shared-components/filter-icon/Utils';
import _ from 'lodash';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import FuseUtils from '@fuse/utils';
import {
	selectCategoriesDateFromFilter,
	selectCategoriesDateToFilter,
	selectCategoriesSearchText,
	setCategoriesDateFromFilter,
	setCategoriesDateToFilter,
	setCategoriesSearchText,
	categoriesInitialState
} from '../store/categoriesSlice';
import { employeeScopes } from '../../employees-app/Utils';

/**
 * The Categories header.
 */

function CategoriesHeader() {
	const { t } = useTranslation('categoriesApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const searchText = useSelector(selectCategoriesSearchText);

	const dateFromFilter = useSelector(selectCategoriesDateFromFilter);
	const dateToFilter = useSelector(selectCategoriesDateToFilter);

	function handleChangeDateFromFilter(event) {
		dispatch(setCategoriesDateFromFilter(event));
	}

	function handleChangeDateToFilter(event) {
		dispatch(setCategoriesDateToFilter(event));
	}

	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<Typography className="text-24 md:text-32 font-extrabold tracking-tight">{t('CATEGORIES')}</Typography>
			</motion.span>

			<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex items-center"
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.3 } }}
				>
					<FilterIcon
						filters={[
							{
								type: FilterTypes.dateTime,
								title: t('START_DATE'),
								value: dateFromFilter as any,
								onChange: handleChangeDateFromFilter,
								maxDate: dateToFilter as any,
								closeOnChange: false,
								disableTime: true
							},
							{
								type: FilterTypes.dateTime,
								title: t('END_DATE'),
								value: dateToFilter as any,
								onChange: handleChangeDateToFilter,
								minDate: dateFromFilter as any,
								closeOnChange: false,
								disableTime: true
							}
						]}
						changesCount={
							[
								!_.isEqual(dateFromFilter, categoriesInitialState.dateFromFilter),
								!_.isEqual(dateToFilter, categoriesInitialState.dateToFilter)
							].filter(Boolean).length
						}
					/>
				</motion.div>
				<motion.div
					className="flex items-center"
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.3 } }}
				>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
						style={{ borderRadius: 8 }}
					>
						<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

						<Input
							placeholder={t('SEARCH_CATEGORIES')}
							className="flex flex-1"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={(ev) => {
								dispatch(setCategoriesSearchText(ev));
							}}
						/>
					</Paper>
				</motion.div>

				{FuseUtils.hasOperationPermission(employeeScopes.categories, 'create', user) && (
					<motion.div
						className="flex flex-grow-0"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					>
						<Button
							variant="contained"
							color="secondary"
							component={NavLinkAdapter}
							to="/categories/new"
							startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
						>
							{t(`ADD_CATEGORY`)}
						</Button>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default CategoriesHeader;
