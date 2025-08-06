import { Controller, FormProvider, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'app/theme-layouts/shared-components/LanguageSwitcher';
import { alpha } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { useDeepCompareEffect } from '@fuse/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CustomPhoneNumber from 'app/shared-components/custom-phone-number/CustomPhoneNumber';
import useAuth from 'src/app/auth/useAuth';
import { requiredEmailValidation, requiredPhoneValidation, requiredStringValidation } from '../../utils/validations';

type RegisterProfileFormType = {
	name: string;
	email: string;
	phoneNumber: string;
	stateId?: string;
	cityId?: string;
	street1?: string;
	street2?: string;
	postalCode?: string;
	apartment?: string;
	complex?: string;
};

function RegisterProfilePage() {
	const { t } = useTranslation('registerProfile');
	const { updateUser } = useAuth();
	const schema = z.object({
		name: requiredStringValidation({ minLength: 2 }),
		email: requiredEmailValidation(),
		phoneNumber: requiredPhoneValidation(),
		// stateId: requiredStringValidation({ minLength: 2 }),
		// cityId: requiredStringValidation({ minLength: 2 }),
		// street1: requiredStringValidation({ minLength: 2 }),
		// street2: requiredStringValidation({ minLength: 2 }),
		// postalCode: requiredStringValidation({ minLength: 2 }),
		// apartment: requiredStringValidation({ minLength: 2 }),
		// complex: requiredStringValidation({ minLength: 2 })
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const [loading, setLoading] = useState(false);
	const [noUser, setNoUser] = useState(false);
	const methods = useForm<RegisterProfileFormType>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			phoneNumber: '+1',
			// stateId: '',
			// cityId: '',
			// street1: '',
			// street2: '',
			// postalCode: '',
			// apartment: '',
			// complex: ''
		},
		resolver: zodResolver(schema)
	});

	const { control, formState, handleSubmit, reset, getValues } = methods;

	const { isValid, dirtyFields, errors } = formState;

	console.log(getValues());

	useDeepCompareEffect(() => {
		function updateUserState() {
			if (!user) {
				setNoUser(true);
			}
		}

		updateUserState();
	}, [dispatch, user]);

	useEffect(() => {
		if (!user) {
			return;
		}

		reset({
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber || '+1',
		});
	}, [user, reset]);

	function onSubmit(data: RegisterProfileFormType) {
		setLoading(true);
		updateUser(data)
			.then((user) => {
				setLoading(false);
				dispatch(
					showMessage({
						message: t('WELCOME'),
						variant: 'success',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
				navigate('/');
			})
			.catch((_errors) => {
				setLoading(false);
				dispatch(
					showMessage({
						message: t('SOMETHING_WENT_WRONG_WHEN_SAVE_PROFILE'),
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
	}

	if (noUser) {
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
					{t('NO_SUCH_USER')}
				</Typography>
			</motion.div>
		);
	}

	return (
		<FormProvider {...methods}>
			<div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
				<svg
					className="w-full h-full absolute"
					xmlns="http://www.w3.org/2000/svg"
					width="100%"
					style={{
						zIndex: -1
					}}
				>
					<rect
						fill="#1565c0"
						width="540"
						height="450"
					/>
					<defs>
						<linearGradient
							id="a"
							gradientUnits="userSpaceOnUse"
							x1="0"
							x2="0"
							y1="0"
							y2="100%"
							gradientTransform="rotate(156,768,347)"
						>
							<stop
								offset="0"
								stopColor="#1565c0"
							/>
							<stop
								offset="1"
								stopColor="#1976d2"
							/>
						</linearGradient>
						<pattern
							patternUnits="userSpaceOnUse"
							id="b"
							width="425"
							height="354.2"
							x="0"
							y="0"
							viewBox="0 0 1080 900"
						>
							<g fillOpacity="0.06">
								<polygon
									fill="#444"
									points="90 150 0 300 180 300"
								/>
								<polygon points="90 150 180 0 0 0" />
								<polygon
									fill="#AAA"
									points="270 150 360 0 180 0"
								/>
								<polygon
									fill="#DDD"
									points="450 150 360 300 540 300"
								/>
								<polygon
									fill="#999"
									points="450 150 540 0 360 0"
								/>
								<polygon points="630 150 540 300 720 300" />
								<polygon
									fill="#DDD"
									points="630 150 720 0 540 0"
								/>
								<polygon
									fill="#444"
									points="810 150 720 300 900 300"
								/>
								<polygon
									fill="#FFF"
									points="810 150 900 0 720 0"
								/>
								<polygon
									fill="#DDD"
									points="990 150 900 300 1080 300"
								/>
								<polygon
									fill="#444"
									points="990 150 1080 0 900 0"
								/>
								<polygon
									fill="#DDD"
									points="90 450 0 600 180 600"
								/>
								<polygon points="90 450 180 300 0 300" />
								<polygon
									fill="#666"
									points="270 450 180 600 360 600"
								/>
								<polygon
									fill="#AAA"
									points="270 450 360 300 180 300"
								/>
								<polygon
									fill="#DDD"
									points="450 450 360 600 540 600"
								/>
								<polygon
									fill="#999"
									points="450 450 540 300 360 300"
								/>
								<polygon
									fill="#999"
									points="630 450 540 600 720 600"
								/>
								<polygon
									fill="#FFF"
									points="630 450 720 300 540 300"
								/>
								<polygon points="810 450 720 600 900 600" />
								<polygon
									fill="#DDD"
									points="810 450 900 300 720 300"
								/>
								<polygon
									fill="#AAA"
									points="990 450 900 600 1080 600"
								/>
								<polygon
									fill="#444"
									points="990 450 1080 300 900 300"
								/>
								<polygon
									fill="#222"
									points="90 750 0 900 180 900"
								/>
								<polygon points="270 750 180 900 360 900" />
								<polygon
									fill="#DDD"
									points="270 750 360 600 180 600"
								/>
								<polygon points="450 750 540 600 360 600" />
								<polygon points="630 750 540 900 720 900" />
								<polygon
									fill="#444"
									points="630 750 720 600 540 600"
								/>
								<polygon
									fill="#AAA"
									points="810 750 720 900 900 900"
								/>
								<polygon
									fill="#666"
									points="810 750 900 600 720 600"
								/>
								<polygon
									fill="#999"
									points="990 750 900 900 1080 900"
								/>
								<polygon
									fill="#999"
									points="180 0 90 150 270 150"
								/>
								<polygon
									fill="#444"
									points="360 0 270 150 450 150"
								/>
								<polygon
									fill="#FFF"
									points="540 0 450 150 630 150"
								/>
								<polygon points="900 0 810 150 990 150" />
								<polygon
									fill="#222"
									points="0 300 -90 450 90 450"
								/>
								<polygon
									fill="#FFF"
									points="0 300 90 150 -90 150"
								/>
								<polygon
									fill="#FFF"
									points="180 300 90 450 270 450"
								/>
								<polygon
									fill="#666"
									points="180 300 270 150 90 150"
								/>
								<polygon
									fill="#222"
									points="360 300 270 450 450 450"
								/>
								<polygon
									fill="#FFF"
									points="360 300 450 150 270 150"
								/>
								<polygon
									fill="#444"
									points="540 300 450 450 630 450"
								/>
								<polygon
									fill="#222"
									points="540 300 630 150 450 150"
								/>
								<polygon
									fill="#AAA"
									points="720 300 630 450 810 450"
								/>
								<polygon
									fill="#666"
									points="720 300 810 150 630 150"
								/>
								<polygon
									fill="#FFF"
									points="900 300 810 450 990 450"
								/>
								<polygon
									fill="#999"
									points="900 300 990 150 810 150"
								/>
								<polygon points="0 600 -90 750 90 750" />
								<polygon
									fill="#666"
									points="0 600 90 450 -90 450"
								/>
								<polygon
									fill="#AAA"
									points="180 600 90 750 270 750"
								/>
								<polygon
									fill="#444"
									points="180 600 270 450 90 450"
								/>
								<polygon
									fill="#444"
									points="360 600 270 750 450 750"
								/>
								<polygon
									fill="#999"
									points="360 600 450 450 270 450"
								/>
								<polygon
									fill="#666"
									points="540 600 630 450 450 450"
								/>
								<polygon
									fill="#222"
									points="720 600 630 750 810 750"
								/>
								<polygon
									fill="#FFF"
									points="900 600 810 750 990 750"
								/>
								<polygon
									fill="#222"
									points="900 600 990 450 810 450"
								/>
								<polygon
									fill="#DDD"
									points="0 900 90 750 -90 750"
								/>
								<polygon
									fill="#444"
									points="180 900 270 750 90 750"
								/>
								<polygon
									fill="#FFF"
									points="360 900 450 750 270 750"
								/>
								<polygon
									fill="#AAA"
									points="540 900 630 750 450 750"
								/>
								<polygon
									fill="#FFF"
									points="720 900 810 750 630 750"
								/>
								<polygon
									fill="#222"
									points="900 900 990 750 810 750"
								/>
								<polygon
									fill="#222"
									points="1080 300 990 450 1170 450"
								/>
								<polygon
									fill="#FFF"
									points="1080 300 1170 150 990 150"
								/>
								<polygon points="1080 600 990 750 1170 750" />
								<polygon
									fill="#666"
									points="1080 600 1170 450 990 450"
								/>
								<polygon
									fill="#DDD"
									points="1080 900 1170 750 990 750"
								/>
							</g>
						</pattern>
					</defs>
					<rect
						x="0"
						y="0"
						fill="url(#a)"
						width="100%"
						height="100%"
					/>
					<rect
						x="0"
						y="0"
						fill="url(#b)"
						width="100%"
						height="100%"
					/>
				</svg>
				<div className="absolute flex flex-col justify-start top-16 end-16 z-10">
					<div className="flex items-center space-x-8">
						<Button
							component={Link}
							to="/sign-out"
							className="whitespace-nowrap mx-auto"
							variant="contained"
							color="error"
							endIcon={<FuseSvgIcon>material-solid:logout</FuseSvgIcon>}
							style={{ borderRadius: 8 }}
						>
							<span>{t('SIGN_OUT')}</span>
						</Button>

						<div
							className="rounded-lg sm:shadow"
							style={{
								backdropFilter: 'blur(10px)',
								backgroundColor: 'white'
							}}
						>
							<LanguageSwitcher />
						</div>
					</div>
				</div>
				<Paper
					className="flex items-center w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow"
					sx={{
						backdropFilter: '10px',
						bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8)
					}}
				>
					<div className="w-full max-w-512 sm:w-512 mx-auto sm:mx-0 ">
						<img
							className="h-48 mx-auto"
							src="assets/images/logo/logo-text.png"
							alt="logo"
						/>

						<Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center">
							{t('REGISTER_YOUR_PROFILE')}
						</Typography>
						<Typography
							className="mt-16"
							textAlign="center"
						>
							{t('PLEASE_COMPLETE_YOUR_PROFILE')}
						</Typography>
						<div className="mt-32">
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-8 mb-16"
										error={!!errors.name}
										required
										helperText={errors?.name?.message}
										label={t('FIRST_NAME')}
										autoFocus
										id="name"
										variant="outlined"
										fullWidth
									/>
								)}
							/>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-8 mb-16"
										error={!!errors.email}
										required
										helperText={errors?.email?.message}
										label={t('EMAIL')}
										id="email"
										variant="outlined"
										disabled
										fullWidth
									/>
								)}
							/>
							<CustomPhoneNumber name="phoneNumber" />
						</div>
						<motion.div
							className="flex self-center"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
						>
							<LoadingButton
								className="whitespace-nowrap w-full"
								variant="contained"
								color="secondary"
								size="large"
								onClick={() => handleSubmit(onSubmit)()}
								loading={loading}
								loadingIndicator={t('SAVING')}
								disabled={_.isEmpty(dirtyFields) || !isValid}
								style={{ borderRadius: 8 }}
							>
								<span>{t('SAVE_PROFILE')}</span>
							</LoadingButton>
						</motion.div>
					</div>
				</Paper>
			</div>
		</FormProvider>
	);
}

export default RegisterProfilePage;
