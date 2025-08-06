import { lazy, memo, Suspense } from "react";
import NotificationPanel from "src/app/main/notifications-app/shared-components/NotificationPanel";
//! TODO: uncomment to implement FCM
// import NotificationPanel from 'src/app/main/common/notifications-app/shared-components/NotificationPanel';

/**
 * The right side layout 1.
 */
function RightSideLayout1() {
  return (
    <Suspense>
      {/* <QuickPanel /> */}

      {/* <MessengerPanel /> */}
      <NotificationPanel />
      {/* //! TODO: uncomment to implement FCM <NotificationPanel /> */}
    </Suspense>
  );
}

export default memo(RightSideLayout1);
