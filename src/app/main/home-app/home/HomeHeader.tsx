import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from 'app/shared-components/Icon';

/**
 * The HomeHeader page.
 */
function HomeHeader() {
	const { t } = useTranslation('homeApp');

	const user = useSelector(selectUser);
	return (
		<div className="flex flex-col w-full px-24 sm:px-32">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
				<div className="flex flex-auto items-center min-w-0">
					<div className="flex flex-col min-w-0 mx-16">
						<Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
							{`${t('WELCOME_BACK')}, ${user.name ?? 'Testing User'}!`}
						</Typography>

						{/* <div className="flex items-center">
							<FuseSvgIcon
								size={20}
								color="action"
							>
								heroicons-solid:bell
							</FuseSvgIcon>
							<Typography
								className="mx-6 leading-6 truncate"
								color="text.secondary"
							>
								You have 2 new messages and 15 new tasks
							</Typography>
						</div> */}
					</div>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-8">
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="error"
						startIcon={
							<Icon
								type="fa6"
								name="FaFileArrowDown"
								size="0.8em"
							/>
						}
						component={Link}
						to="/orders/new"
					>
						{t('NEW_ORDER')}
					</Button>
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="success"
						startIcon={
							<Icon
								type="fa6"
								name="FaFileArrowUp"
								size="0.8em"
							/>
						}
						component={Link}
						to="/products/new"
					>
						{t('NEW_PRODUCT')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default HomeHeader;
