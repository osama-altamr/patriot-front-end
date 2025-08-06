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
import { requiredStringValidation, optionalStringValidation } from 'src/app/main/utils/validations';
import ComplaintHeader from './ComplaintHeader';
import { useGetComplaintQuery } from '../ComplaintsApi';
import ComplaintModel, { complaintDefaultValues } from '../models/ComplaintModel';
import IComplaint from '../models/IComplaint';
import BasicInfoTab from './tabs/BasicInfoTab';

function Complaint() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('complaintsApp');
	const schema = z.object({
		description: requiredStringValidation(),
		fileUrl: optionalStringValidation(),
		location: optionalStringValidation(),
		type: requiredStringValidation(),
		status: optionalStringValidation(),
		userId: requiredStringValidation(),
		closedById: optionalStringValidation()
	});
	const routeParams = useParams();
	const { complaintId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	const {
		data: complaint,
		isLoading,
		isError
	} = useGetComplaintQuery(complaintId, {
		skip: !complaintId || complaintId === 'new'
	});

	const methods = useForm<IComplaint>({
		mode: 'onChange',
		defaultValues: complaintDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (complaintId === 'new') {
			reset(ComplaintModel({}));
		}
	}, [complaintId, reset]);

	useEffect(() => {
		if (complaint) {
			reset({ ...complaint });
		}
	}, [complaint, reset]);

	if (isError && complaintId !== 'new') {
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
					{t(`NO_COMPLAINT`)}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/complaints"
					color="inherit"
				>
					{t(`GO_TO_COMPLAINTS`)}
				</Button>
			</motion.div>
		);
	}

	if (
		isLoading ||
		_.isEmpty(form) ||
		(complaint && routeParams.complaintId !== complaint.id && routeParams.complaintId !== 'new')
	) {
		return <FuseLoading />;
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ComplaintHeader />}
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
								<BasicInfoTab complaint={complaint} />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Complaint;
