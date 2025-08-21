import FusePageCarded from '@fuse/core/FusePageCarded';
import { useThemeMediaQuery } from '@fuse/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import OperationsTable from './OperationsTable';
import OperationsHeader from './OperationsHeader';
import GlassCuttingPage from './components/GlassCuttingPage';

const GLASS_CUTTING_STAGE_ID = '19aa52ec-9554-46b9-b38e-58ff4c2e9636';

function Operations() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const user = useAppSelector(selectUser);
	const isGlassCuttingUser = true
	// user.permissions?.stage?.id === GLASS_CUTTING_STAGE_ID;
	return (
		<FusePageCarded
			header={<OperationsHeader />}
			content={isGlassCuttingUser ? <GlassCuttingPage /> : <OperationsTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Operations;
