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
import {
	requiredStringValidation,
	optionalStringValidation,
	localeStringValidation
} from 'src/app/main/utils/validations';
import StageDesignHeader from './StageDesignHeader';
import { useGetStageDesignQuery } from '../StageDesignsApi';
import StageDesignModel, { stageDesignDefaultValues } from '../models/StageDesignModel';
import IStageDesign from '../models/IStageDesign';
import BasicInfoTab from './tabs/BasicInfoTab';

function StageDesign() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('stageDesignsApp');
	const schema = z.object({
		title: localeStringValidation(),
		imageUrl: optionalStringValidation(),
		stageId: requiredStringValidation()
	});
	const routeParams = useParams();
	const { stageDesignId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	const {
		data: stageDesign,
		isLoading,
		isError
	} = useGetStageDesignQuery(stageDesignId, {
		skip: !stageDesignId || stageDesignId === 'new'
	});

	const methods = useForm<IStageDesign>({
		mode: 'onChange',
		defaultValues: stageDesignDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (stageDesignId === 'new') {
			reset(StageDesignModel({}));
		}
	}, [stageDesignId, reset]);

	useEffect(() => {
		if (stageDesign) {
			reset({ ...stageDesign });
		}
	}, [stageDesign, reset]);

	if (isError && stageDesignId !== 'new') {
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
					{t(`NO_STAGE_DESIGN`)}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/stage-designs"
					color="inherit"
				>
					{t(`GO_TO_STAGE_DESIGNS`)}
				</Button>
			</motion.div>
		);
	}

	if (
		isLoading ||
		_.isEmpty(form) ||
		(stageDesign && routeParams.stageDesignId !== stageDesign.id && routeParams.stageDesignId !== 'new')
	) {
		return <FuseLoading />;
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<StageDesignHeader />}
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
								<BasicInfoTab stageDesign={stageDesign} />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default StageDesign;
