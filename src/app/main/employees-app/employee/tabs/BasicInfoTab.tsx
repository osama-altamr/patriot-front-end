/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, TextField, MenuItem, Chip } from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import IEmployee, { IEmployeeScope } from '../../models/IEmployee';
import { employeeAccessType, toEmployeeAccessTypeTitle, employeeScopes, toEmployeeScopesTitle } from '../../Utils';

function BasicInfoTab({ employee }: { employee?: IEmployee }) {
	const { t } = useTranslation('employeesApp');
	const methods = useFormContext<IEmployee>();
	const { control, formState } = methods;
	const { errors } = formState;

	const allPossibleScopes: IEmployeeScope[] = Object.values(employeeScopes).map((feature) => ({
		feature,
		read: true,
		write: true
	}));

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
				getItemUrl="v1/users"
				getItemsUrl="v1/users"
				defaultItem={employee?.user}
				defaultItemId={employee?.userId}
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
			<Controller
				name="scopes"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						value={field.value || []}
						className="mt-8 mb-16"
						error={!!errors.scopes}
						helperText={errors?.scopes?.message}
						required
						label={t('SCOPES')}
						id="scopes"
						variant="outlined"
						fullWidth
						select
						SelectProps={{
							multiple: true,
							renderValue: (selected: IEmployeeScope[]) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{/* This map is now safe because `selected` will always be an array */}
									{selected.map((scope) => (
										<Chip
											key={scope.feature}
											label={t(toEmployeeScopesTitle(scope.feature))}
										/>
									))}
								</Box>
							),
							isEqual: (option, value) => option.feature === value.feature
						}}
					>
						{allPossibleScopes.map((scopeOption) => (
							<MenuItem
								key={scopeOption.feature}
								value={scopeOption}
							>
								{t(toEmployeeScopesTitle(scopeOption.feature))}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;