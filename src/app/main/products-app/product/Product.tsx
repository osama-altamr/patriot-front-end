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
	optionalStringValidation,
	localeStringValidation,
	requiredNumberValidation,
	arrayValidation
} from 'src/app/main/utils/validations';
import ProductHeader from './ProductHeader';
import { useGetProductQuery } from '../ProductsApi';
import ProductModel, { productDefaultValues } from '../models/ProductModel';
import IProduct from '../models/IProduct';
import BasicInfoTab from './tabs/BasicInfoTab';

function Product() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { t } = useTranslation('productsApp');
	const schema = z.object({
		name: localeStringValidation().optional(),
		description: localeStringValidation().optional(),
		imageUrl: optionalStringValidation().optional(),
		height: requiredNumberValidation()
			.or(
				optionalStringValidation()
					.transform((val) => Number(val))
					.optional()
			)
			.optional(),
		width: requiredNumberValidation()
			.or(
				optionalStringValidation()
					.transform((val) => Number(val))
					.optional()
			)
			.optional(),
		categoryId: optionalStringValidation(),
		stageIds: arrayValidation({ optional: true }).optional(),
		pricePerSquareMeter: requiredNumberValidation().or(
			optionalStringValidation()
				.transform((val) => Number(val))
				.optional()
		).optional().nullable()
	});
	const routeParams = useParams();
	const { productId } = routeParams;

	const [tabValue, setTabValue] = useState(0);

	const {
		data: product,
		isLoading,
		isError
	} = useGetProductQuery(productId, {
		skip: !productId || productId === 'new'
	});

	const methods = useForm<IProduct>({
		mode: 'onChange',
		defaultValues: productDefaultValues,
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);

	useEffect(() => {
		if (product) {
			reset({ ...product });
		}
	}, [product, reset]);

	if (isError && productId !== 'new') {
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
					{t(`NO_PRODUCT`)}
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/products"
					color="inherit"
				>
					{t(`GO_TO_PRODUCTS`)}
				</Button>
			</motion.div>
		);
	}

	if (
		isLoading ||
		_.isEmpty(form) ||
		(product && routeParams.productId !== product.id && routeParams.productId !== 'new')
	) {
		return <FuseLoading />;
	}

	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
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
								<BasicInfoTab product={product} />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Product;
