import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { requiredStringValidation, optionalStringValidation, arrayValidation } from 'src/app/main/utils/validations';
import EmployeeHeader from './EmployeeHeader';
import { useGetEmployeeQuery } from '../EmployeesApi';
import EmployeeModel, { employeeDefaultValues } from '../models/EmployeeModel';
import IEmployee from '../models/IEmployee';
import BasicInfoTab from './tabs/BasicInfoTab';

function Employee() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('employeesApp');
	const scopeObject = z.object({
		feature: z.string(),
		write: z.boolean(),
		read: z.boolean()
	})
	const schema = z.object({
		userId: requiredStringValidation(),
		stageId: optionalStringValidation(),
		accessType: requiredStringValidation(),
		scopes: arrayValidation({ itemSchema: scopeObject, minLength: 1 })
	});
	const routeParams = useParams();
	const { employeeId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	const {
		data: employee,
		isLoading,
		isError
	} = useGetEmployeeQuery(employeeId, {
		skip: !employeeId || employeeId === 'new'
	});

	const methods = useForm<IEmployee>({
		mode: 'onChange',
		defaultValues: employeeDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (employeeId === 'new') {
			reset(EmployeeModel({}));
		}
	}, [employeeId, reset]);

	useEffect(() => {
		if (employee) {
			reset({ ...employee });
		}
	}, [employee, reset]);

	if (isError && employeeId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					{t(`NO_EMPLOYEE`)}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/employees"
					color="inherit"
				>
					{t(`GO_TO_EMPLOYEES`)}
				</Button>
			</motion.div>
		);
	}

	if (
		isLoading ||
		_.isEmpty(form) ||
		(employee && routeParams.employeeId !== employee.id && routeParams.employeeId !== 'new')
	) {
		return <FuseLoading />;
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<EmployeeHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label={t('BASIC_INFO')}
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-4xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab employee={employee} />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Employee;