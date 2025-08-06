import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'app/theme-layouts/shared-components/LanguageSwitcher';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useJwtAuth from 'src/app/auth/services/jwt/useJwtAuth';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';
import { requiredEmailValidation, requiredStringValidation } from '../../utils/validations';

type SignUpFormType = {
	email: string;
	password: string;
	passwordConfirm: string;
};

function SignUpPage() {
	const { t } = useTranslation('signUp');
	const { signUpWithEmailAndPassword } = useJwtAuth();
	const schema = z
		.object({
			email: requiredEmailValidation(),
			password: requiredStringValidation({ minLength: 8 }),
			passwordConfirm: requiredStringValidation({ minLength: 8 })
		})
		.superRefine((data, ctx) => {
			if (data.password !== data.passwordConfirm) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('PASSWORDS_MUST_MATCH'),
					path: ['passwordConfirm']
				});
			}
		});
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const { control, formState, handleSubmit } = useForm<SignUpFormType>({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			passwordConfirm: ''
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit({ email, password }: SignUpFormType) {
		setLoading(true);
		signUpWithEmailAndPassword(email, password)
			.then((user) => {
				setLoading(false);
				// setTimeout(() => {
				//   if (!user.firstName) {
				//     navigate("/register");
				//   } else {
				//     navigate("/home");
				//   }
				// }, 1000);
				// No need to do anything, admin data will be set at app/auth/AuthContext
			})
			.catch((_errors) => {
				setLoading(false);
				dispatch(
					showMessage({
						message: t('SOMETHING_WENT_WRONG_WHILE_SIGN_UP'),
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
	}

	return (
		<div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
			<div className="absolute flex flex-col justify-start top-16 end-16 z-10">
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
			<Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
				<div className="flex flex-col w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
					<img
						className="h-64 self-center"
						src="assets/images/logo/logo.png"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
						{t('SIGN_UP')}
					</Typography>

					<form
						name="loginForm"
						noValidate
						className="flex flex-col justify-center w-full mt-32"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label={t('EMAIL')}
									autoFocus
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label={t('PASSWORD')}
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="passwordConfirm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label={t('PASSWORD_CONFIRMATION')}
									type="password"
									error={!!errors.passwordConfirm}
									helperText={errors?.passwordConfirm?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<LoadingButton
							variant="contained"
							color="secondary"
							className=" w-full mt-16"
							aria-label="Sign in"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
							loading={loading}
							loadingIndicator={t('SIGNING_UP')}
						>
							{t('SIGN_UP')}
						</LoadingButton>
					</form>
					<div className="flex items-baseline mt-16 font-medium">
						<Typography>{t('BACK_TO')}</Typography>
						<Link
							className="ms-4"
							to="/sign-in"
						>
							{t('sIGN_IN')}
						</Link>
					</div>
				</div>
			</Paper>

			<Box className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden">
				<svg
					className="w-full h-full absolute inset-0 pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					width="100%"
					style={{
						zIndex: -1
					}}
				>
					<rect
						fill="#000000"
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
								stopColor="#000000"
							/>
							<stop
								offset="1"
								stopColor="#161618"
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
				<div className="z-10 relative w-full max-w-2xl">
					{/* <div className="text-7xl font-semibold leading-none text-gray-100 flex items-center space-x-16">
            <img
              src={"assets/images/logo/logo-text-only-dark.png"}
              style={{ height: "150px" }}
              alt="Logo"
            />
          </div> */}
					<div className="text-4xl mt-16  leading-none text-gray-100">
						<div />
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SignUpPage;
