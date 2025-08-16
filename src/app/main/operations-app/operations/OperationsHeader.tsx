import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useTranslation } from 'react-i18next';
import { Input, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'app/store/store';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import {
	selectOperationsDateFromFilter,
	selectOperationsDateToFilter,
	selectOperationsSearchText,
	setOperationsDateFromFilter,
	setOperationsDateToFilter,
	setOperationsSearchText,
	selectOperationsCurrentStageIdFilter,
	setOperationsCurrentStageIdFilter
} from '../store/operationsSlice';

/**
 * The Operations header.
 */

function OperationsHeader() {
	const { t } = useTranslation('operationsApp');
	const dispatch = useDispatch<AppDispatch>();
	const user = useAppSelector(selectUser);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const searchText = useSelector(selectOperationsSearchText);

	const currentStageIdFilter = useSelector(selectOperationsCurrentStageIdFilter);
	const dateFromFilter = useSelector(selectOperationsDateFromFilter);
	const dateToFilter = useSelector(selectOperationsDateToFilter);

	function handleChangeCurrentStageIdFilter(event) {
		dispatch(setOperationsCurrentStageIdFilter(event));
	}

	function handleChangeDateFromFilter(event) {
		dispatch(setOperationsDateFromFilter(event));
	}

	function handleChangeDateToFilter(event) {
		dispatch(setOperationsDateToFilter(event));
	}

	return (
		<div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<Typography className="text-24 md:text-32 font-extrabold tracking-tight">{t('OPERATIONS')}</Typography>
			</motion.span>

			<div className="flex flex-1 items-center justify-end space-x-8">
				<motion.div
					className="flex items-center"
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.3 } }}
				/>
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
							placeholder={t('SEARCH_OPERATIONS')}
							className="flex flex-1"
							disableUnderline
							fullWidth
							value={searchText}
							inputProps={{
								'aria-label': 'Search'
							}}
							onChange={(ev) => {
								dispatch(setOperationsSearchText(ev));
							}}
						/>
					</Paper>
				</motion.div>
			</div>
		</div>
	);
}

export default OperationsHeader;
