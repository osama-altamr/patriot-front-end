import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha } from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import LocaleInput from 'app/shared-components/locale-input/LocaleInput';
import MediaInput from 'app/shared-components/media-input/MediaInput';
import IStageDesign from '../../models/IStageDesign';

function BasicInfoTab({ stageDesign }: { stageDesign?: IStageDesign }) {
	const { t } = useTranslation('stageDesignsApp');
	const methods = useFormContext<IStageDesign>();
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

			<LocaleInput
				name="title"
				label={t('TITLE')}
			/>
			<MediaInput
				name="imageUrl"
				label={t('IMAGE_URL')}
				imageUrl={stageDesign?.imageUrl}
				required={false}
			/>
			<CustomAutoComplete
				name="stageId"
				label={t('STAGE')}
				placeholder={t('SELECT_SINGLE_STAGE')}
				getItemUrl="v1/stages"
				getItemsUrl="v1/stages"
				defaultItem={stageDesign?.stage}
				defaultItemId={stageDesign?.stageId}
			/>
		</div>
	);
}

export default BasicInfoTab;
