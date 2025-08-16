import { CircularProgress, Paper, Typography } from '@mui/material';
import { useGetMaterialGridQuery } from '../../OperationsApi';

function MaterialGridDisplay() {
	const { data, error, isLoading, isFetching } = useGetMaterialGridQuery(undefined, {
		pollingInterval: 10000 // 10000 ms = 10 seconds
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-full">
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return <Typography color="error">Failed to load material grid data.</Typography>;
	}

	const isUpdating = isFetching && !isLoading;

	return (
		<Paper className="p-24">
			<div className="flex justify-between items-center mb-16">
				<Typography variant="h6">Material Optimization Grid</Typography>
				{isUpdating && <CircularProgress size={20} />}
			</div>

			{data && data.packedItems && data.packedItems.length > 0 ? (
				<pre>{JSON.stringify(data.packedItems, null, 2)}</pre>
			) : (
				<Typography>No optimization results available yet. The grid will update automatically.</Typography>
			)}
		</Paper>
	);
}

export default MaterialGridDisplay;
