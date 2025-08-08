import { useTranslation } from 'react-i18next';
import { Box, Checkbox, FormControlLabel, Icon } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { toEmployeeScopeIcon, toEmployeeScopesTitle } from '../../Utils';
import IEmployee from '../../models/IEmployee';

function EmployeeScope({
	item,
	index,
	onChangeCheck
}: {
	item: string;
	index: number;
	onChangeCheck: () => void;
}) {
	const { t } = useTranslation('employeesApp');
	const methods = useFormContext<IEmployee>();
	const { control } = methods;

	return (
		<Box
			component="div"
			className="w-full border border-solid rounded-lg flex flex-col space-y-16 p-16"
			sx={{
				bgcolor: (theme) => (index === -1 ? theme.palette.background.default : theme.palette.background.paper),
				borderColor: (theme) => theme.palette.divider
			}}
		>
			<div className="w-full flex items-center justify-between space-x-8">
				<div className="w-full flex items-center space-x-8">
					<Icon color="action">{toEmployeeScopeIcon(item)}</Icon>
					<Box
						component="div"
						className="text-18 font-semibold"
					>
						{t(toEmployeeScopesTitle(item))}
					</Box>
				</div>
				<Checkbox
					className="m-0 p-0"
					checked={index > -1}
					onChange={onChangeCheck}
					color="secondary"
				/>
			</div>

			{/* Read/Write Checkboxes */}
			<div className="flex space-x-16">
				{index === -1 ? (
					<>
						<FormControlLabel
							disabled
							control={<Checkbox checked={false} />}
							label={t('READ')}
						/>
						<FormControlLabel
							disabled
							control={<Checkbox checked={false} />}
							label={t('WRITE')}
						/>
					</>
				) : (
					<>
						<Controller
							name={`scopes.${index}.read`}
							control={control}
							render={({ field }) => (
								<FormControlLabel
									{...field}
									control={
										<Checkbox
											checked={field.value}
											color="info"
										/>
									}
									label={t('READ')}
								/>
							)}
						/>
						<Controller
							name={`scopes.${index}.write`}
							control={control}
							render={({ field }) => (
								<FormControlLabel
									{...field}
									control={
										<Checkbox
											checked={field.value}
											color="info"
										/>
									}
									label={t('WRITE')}
								/>
							)}
						/>
					</>
				)}
			</div>
		</Box>
	);
}

export default EmployeeScope;