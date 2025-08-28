import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import IEmployee from '../../models/IEmployee';
import EmployeeScopes from '../components/EmployeeScopes';
import { employeeAccessType, toEmployeeAccessTypeTitle } from '../../Utils';
import { alpha } from '@mui/system';

function BasicInfoTab({ employee }: { employee?: IEmployee }) {
	const { t } = useTranslation('employeesApp');
	const methods = useFormContext<IEmployee>();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div>
			<Box
				component="div"
				className="py-8 px-16 my-16 w-full rounded-lg"
				sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
			>
				<Typography className="text-17 font-bold">{t('MAIN_INFORMATION')}</Typography>
			</Box>
			<CustomAutoComplete
				name="userId"
				label={t('USER')}
				placeholder={t('SELECT_SINGLE_USER')}
				defaultItem={employee?.user}
				defaultItemId={employee?.userId}
				getItemUrl="v1/users?role=admin"
				getItemsUrl="v1/users?role=admin"
				getOptionLabel={(option: any) => option.name || ''}
			/>
			<CustomAutoComplete
				name="stageId"
				label={t('STAGE')}
				placeholder={t('SELECT_SINGLE_STAGE')}
				getItemUrl="v1/stages"
				getItemsUrl="v1/stages"
				defaultItem={employee?.stage}
				defaultItemId={employee?.stageId}
				required={false}
			/>
			<Controller
				name="accessType"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.accessType}
						helperText={errors?.accessType?.message}
						required
						label={t('ACCESS_TYPE')}
						id="accessType"
						variant="outlined"
						fullWidth
						select
					>
						{Object.values(employeeAccessType).map((value, index) => (
							<MenuItem
								key={index}
								value={value}
							>
								{t(toEmployeeAccessTypeTitle(value))}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
			<EmployeeScopes/>
		</div>
	);
}

export default BasicInfoTab;