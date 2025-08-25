import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Box
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FuseLoading from '@fuse/core/FuseLoading';
import IUser from 'src/app/main/users-app/models/IUser';
import { useGetDriversQuery } from 'src/app/main/users-app/UsersApi';

interface AssignDriverDialogProps {
	open: boolean;
	onClose: () => void;
	onAssign: (driverId: string) => void;
}

function AssignDriverDialog({ open, onClose, onAssign }: AssignDriverDialogProps) {
	const { t } = useTranslation('ordersApp');
	const [selectedDriverId, setSelectedDriverId] = useState('');

	// FIX: Call the query without arguments as it doesn't need any.
	const { data: drivers, isLoading } = useGetDriversQuery();

	const handleAssign = () => {
		if (selectedDriverId) {
			onAssign(selectedDriverId);
			onClose();
		}
	};
	const handleClose = () => {
		setSelectedDriverId('');
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
		>
			<DialogTitle>{t('ASSIGN_DRIVER')}</DialogTitle>
			<DialogContent>
				{isLoading ? (
					<Box className="flex justify-center p-48">
						<FuseLoading />
					</Box>
				) : (
					<FormControl
						fullWidth
						sx={{ mt: 2 }}
					>
						<InputLabel id="driver-select-label">{t('SELECT_A_DRIVER')}</InputLabel>
						<Select
							labelId="driver-select-label"
							value={selectedDriverId}
							label={t('SELECT_A_DRIVER')}
							onChange={(e) => setSelectedDriverId(e.target.value)}
						>
							{/* FIX: Map over `drivers.results` to match your API response structure */}
							{drivers?.results?.map((driver: IUser) => (
								<MenuItem
									key={driver.id}
									value={driver.id}
								>
									{driver.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>{t('CANCEL')}</Button>
				<Button
					onClick={handleAssign}
					variant="contained"
					color="primary"
					disabled={!selectedDriverId || isLoading}
				>
					{t('ASSIGN')}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AssignDriverDialog;
