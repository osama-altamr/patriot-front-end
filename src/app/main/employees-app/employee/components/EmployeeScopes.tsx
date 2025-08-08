import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { employeeScopes } from '../../Utils';
import IEmployee from '../../models/IEmployee';
import EmployeeScope from './EmployeeScope';

function EmployeeScopes() {
	const { t } = useTranslation('employeesApp');
	const methods = useFormContext<IEmployee>();
	const { control, getValues, getFieldState } = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: `scopes`
	});

	function handleChangeCheck(item: string) {
		const existingIndex = fields.findIndex((f) => f.feature === item);

		if (existingIndex > -1) {
			// If it exists, remove it
			remove(existingIndex);
		} else {
			// If it doesn't exist, add it with default read/write permissions
			append({
				feature: item,
				read: true,
				write: true
			});
		}
	}

	return (
		<>
			<Box
				component="div"
				className="py-8 px-16 my-16 w-full rounded-lg"
				sx={{ bgcolor: (theme) => theme.palette.info.light, color: (theme) => theme.palette.info.dark }}
			>
				<Typography className="text-17 font-bold">{t('PERMISSIONS')}</Typography>
			</Box>
			{getFieldState(`scopes`).invalid && (
				<Typography
					color="error"
					className="text-14 my-8"
					textAlign="center"
				>
					{getFieldState(`scopes`).error.message}
				</Typography>
			)}
			<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
				{Object.values(employeeScopes).map((item) => (
					<EmployeeScope
						key={item}
						item={item}
						index={fields.findIndex((f) => f.feature === item)}
						onChangeCheck={() => handleChangeCheck(item)}
					/>
				))}
			</div>
		</>
	);
}

export default EmployeeScopes;