import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Paper, Typography, Box, Tooltip, Stack, Icon } from '@mui/material';
import { motion } from 'framer-motion';
import localeString from 'src/app/main/utils/localeString'; // Check this import path
import { useGetMaterialGridQuery } from '../../OperationsApi'; // Check this import path

// --- Enhanced Styling ---
const colors = [
	'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)', // Indigo
	'linear-gradient(135deg, #ef5350 0%, #e53935 100%)', // Red
	'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)', // Green
	'linear-gradient(135deg, #ffca28 0%, #ffb300 100%)', // Amber
	'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)', // Purple
	'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)', // Cyan
	'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'  // Orange
];

const AXIS_COLOR = '#757575';
const AXIS_THICKNESS = 30; // The width/height of the rulers

// --- Helper component for generating Axis Ticks ---
const AxisTicks = ({ length, scale, step, isVertical = false }) => {
	const ticks = [];
	for (let i = 0; i <= length; i += step) {
		ticks.push(i);
	}
	return (
		<>
			{ticks.map(tick => (
				<Box
					key={tick}
					sx={{
						position: 'absolute',
						// --- CHANGE #1: Use `bottom` for vertical ticks to flip the Y-axis ruler ---
						...(isVertical ? { bottom: tick * scale, left: 0, width: '100%', height: '1px' } : { left: tick * scale, top: 0, height: '100%', width: '1px' }),
						backgroundColor: AXIS_COLOR,
						opacity: 0.3,
					}}
				>
					<Typography
						variant="caption"
						sx={{
							position: 'absolute',
							color: AXIS_COLOR,
							// Adjust label position accordingly
							...(isVertical ? { bottom: -8, left: 5 } : { left: 2, top: 2 }),
						}}
					>
						{tick}
					</Typography>
				</Box>
			))}
		</>
	);
};

function MaterialGridDisplay() {
	const { t } = useTranslation('operationsApp');
	const containerRef = useRef<HTMLDivElement>(null);

	const { data, error, isLoading, isFetching } = useGetMaterialGridQuery(undefined, {
		pollingInterval: 10000,
	});

	const [scale, setScale] = useState(1);

	useEffect(() => {
		const calculateScale = () => {
			if (data?.materialDimensions && containerRef.current) {
				const { width: totalWidth, height: totalHeight } = data.materialDimensions;
				
				const availableWidth = containerRef.current.offsetWidth - AXIS_THICKNESS - 48;
				const availableHeight = window.innerHeight * 0.6;

				if (totalWidth <= 0 || totalHeight <= 0) return;

				const scaleX = availableWidth / totalWidth;
				const scaleY = availableHeight / totalHeight;
				const finalScale = Math.min(scaleX, scaleY);

				setScale(finalScale);
			}
		};

		calculateScale();
		window.addEventListener('resize', calculateScale);
		return () => window.removeEventListener('resize', calculateScale);
	}, [data]);

	if (isLoading) {
		return <div className="flex justify-center items-center h-96"><CircularProgress /></div>;
	}

	if (error) {
		return <Typography color="error">{t('FAILED_TO_LOAD_GRID')}</Typography>;
	}

	const isUpdating = isFetching && !isLoading;
	const materialDimensions = data?.materialDimensions;

	return (
		<Paper ref={containerRef} className="p-24 w-full" sx={{ minHeight: 400 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<Stack>
					<Typography variant="h6">{t('MATERIAL_OPTIMIZATION_GRID')}</Typography>
					{materialDimensions && (
						<Typography variant="body2" color="text.secondary">
							{t('SHEET_DIMENSIONS')}: {materialDimensions.width} x {materialDimensions.height}
						</Typography>
					)}
				</Stack>
				<Stack direction="row" alignItems="center" spacing={2}>
					{data?.utilization && (
						<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
							{t('UTILIZATION')}: {(data.utilization * 100).toFixed(2)}%
						</Typography>
					)}
					{isUpdating && <CircularProgress size={20} />}
				</Stack>
			</Stack>

			{data && data.packedItems && data.packedItems.length > 0 && materialDimensions ? (
				<Box sx={{ display: 'flex', mt: 2 }}>
					{/* Y-Axis Ruler */}
					<Box sx={{ width: AXIS_THICKNESS, height: materialDimensions.height * scale, position: 'relative', mr: 1 }}>
						<AxisTicks length={materialDimensions.height} scale={scale} step={100} isVertical />
					</Box>
					<Box sx={{ flex: 1 }}>
						{/* X-Axis Ruler */}
						<Box sx={{ height: AXIS_THICKNESS, width: materialDimensions.width * scale, position: 'relative', mb: 1 }}>
							<AxisTicks length={materialDimensions.width} scale={scale} step={100} />
						</Box>
						{/* The Coordinate Plane */}
						<Box
							sx={{
								position: 'relative',
								width: materialDimensions.width * scale,
								height: materialDimensions.height * scale,
								border: `1px solid ${AXIS_COLOR}`,
								backgroundColor: '#fafafa',
								boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
							}}
						>
							{data.packedItems.map((item, index) => (
								<Tooltip
									key={item.id}
									title={
										<div>
											<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
												{localeString(item.item.product.name)}
											</Typography>
											<Typography variant="caption">
												{t('DIMENSIONS')}: {item.width} x {item.height}
											</Typography>
											<br />
											<Typography variant="caption">
												{t('POSITION')}: ({item.x}, {item.y})
											</Typography>
										</div>
									}
									placement="top" arrow
								>
									<Box
										component={motion.div}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
										sx={{
											position: 'absolute',
											boxSizing: 'border-box',
											left: item.x * scale,
											// --- CHANGE #2: Use `bottom` for item placement instead of `top` ---
											bottom: item.y * scale,
											width: item.width * scale,
											height: item.height * scale,
											background: colors[index % colors.length],
											border: '1px solid rgba(255, 255, 255, 0.7)',
											boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											overflow: 'hidden',
											cursor: 'pointer',
											borderRadius: '4px',
										}}
									>
										{(item.width * scale > 60) && (
											<Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 2px black' }}>
												{item.width}x{item.height}
											</Typography>
										)}
									</Box>
								</Tooltip>
							))}
						</Box>
					</Box>
				</Box>
			) : (
				<Box className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500">
					<Icon>grid_off</Icon>
					<Typography sx={{ mt: 2 }}>{t('NO_OPTIMIZATION_RESULTS')}</Typography>
				</Box>
			)}
		</Paper>
	);
}

export default MaterialGridDisplay;