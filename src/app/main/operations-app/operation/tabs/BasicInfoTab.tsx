import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha } from '@mui/material';
import IOperation from '../../models/IOperation';

function BasicInfoTab({ operation }: { operation?: IOperation }) {
	const { t } = useTranslation('operationsApp');
	const methods = useFormContext<IOperation>();
	const { control, formState, watch, getFieldState, getValues } = methods;
	const { errors } = formState;
	const { id } = watch();
	console.log(getValues());
	return (
		<div>
			<Box
				component="div"
				className="py-8 px-16 my-16 w-full rounded-lg"
				sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
			>
				<Typography className="text-17 font-bold">{t('MAIN_INFORMATION')}</Typography>
			</Box>
		</div>
	);
}

export default BasicInfoTab;
