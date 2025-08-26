import FusePageCarded from '@fuse/core/FusePageCarded';
import { useThemeMediaQuery } from '@fuse/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import OperationsTable from './OperationsTable';
import OperationsHeader from './OperationsHeader';
import GlassCuttingPage from './components/GlassCuttingPage';

const GLASS_CUTTING_STAGE_ID = '51a02805-6fab-4280-a026-fc150d446a43';

function Operations() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const user = useAppSelector(selectUser);
	const isGlassCuttingUser = user.permissions?.stage?.id === GLASS_CUTTING_STAGE_ID;
	return (
		<FusePageCarded
			header={<OperationsHeader />}
			content={isGlassCuttingUser ? <GlassCuttingPage /> : <OperationsTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Operations;
