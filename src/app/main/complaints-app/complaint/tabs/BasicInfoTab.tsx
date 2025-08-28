/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, TextField, MenuItem } from '@mui/material';
import CustomAutoComplete from 'app/shared-components/custom-auto-complete/CustomAutoComplete';
import MediaInput from 'app/shared-components/media-input/MediaInput';
import { complaintType, toComplaintTypeTitle, complaintStatus, toComplaintStatusTitle } from '../../Utils';
import IComplaint from '../../models/IComplaint';

function BasicInfoTab({ complaint }: { complaint?: IComplaint }) {
	const { t } = useTranslation('complaintsApp');
	const methods = useFormContext<IComplaint>();
	const { control, formState, watch, getFieldState, getValues } = methods;
	const { errors } = formState;
	const { id, status } = watch();
	return (
		<div>
			<Box
				component="div"
				className="py-8 px-16 my-16 w-full rounded-lg"
				sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
			>
				<Typography className="text-17 font-bold">{t('MAIN_INFORMATION')}</Typography>
			</Box>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.description}
						helperText={errors?.description?.message}
						required
						label={t('DESCRIPTION')}
						id="description"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<MediaInput
				name="fileUrl"
				label={t('FILE_URL')}
				imageUrl={complaint?.fileUrl}
				// type={ComplainType.fileField}
				required={false}
			/>
			<Controller
				name="location"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.location}
						helperText={errors?.location?.message}
						label={t('LOCATION')}
						id="location"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.type}
						helperText={errors?.type?.message}
						required
						label={t('TYPE')}
						id="type"
						variant="outlined"
						fullWidth
						select
					>
						{Object.values(complaintType).map((value, index) => (
							<MenuItem
								key={index}
								value={value}
							>
								{t(toComplaintTypeTitle(value))}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
			<Controller
				name="status"
				control={control}
				defaultValue={complaintStatus.pending}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.status}
						helperText={errors?.status?.message}
						label={t('STATUS')}
						id="status"
						variant="outlined"
						fullWidth
						select
					>
						{Object.values(complaintStatus).map((value, index) => (
							<MenuItem
								key={index}
								value={value}
							>
								{t(toComplaintStatusTitle(value))}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
			<CustomAutoComplete
				name="userId"
				label={t('USER')}
				placeholder={t('SELECT_SINGLE_USER')}
				getItemUrl="v1/users"
				getOptionLabel={(option: any) => option.name || ''}
				getItemsUrl="v1/users"
				defaultItem={complaint?.user}
				defaultItemId={complaint?.userId}
			/>
			<CustomAutoComplete
				name="closedById"
				label={t('CLOSED_BY')}
				placeholder={t('SELECT_SINGLE_CLOSED_BY')}
				getItemUrl="v1/users"
				getItemsUrl="v1/users"
				disabled
				getOptionLabel={(option: any) => option.name || ''}
				defaultItem={complaint?.closedBy}
				defaultItemId={complaint?.closedById}
				required={false}
			/>
		</div>
	);
}

export default BasicInfoTab;
