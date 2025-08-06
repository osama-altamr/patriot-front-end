import FuseScrollbars from "@fuse/core/FuseScrollbars";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NotificationCard from "./NotificationCard";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "app/store/store";
import {
  closeNotificationsPanel,
  selectNotificationsPanelState,
} from "../store/notificationsSlice";
import {
  useDismissAllNotificationsMutation,
  useDismissNotificationMutation,
  useGetUnreadNotificationsQuery,
} from "../NotificationsApi";

function Notifications() {
  const { t } = useTranslation("notificationsApp");
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: notifications, refetch } = useGetUnreadNotificationsQuery();
  const [dismissNotification] = useDismissNotificationMutation();

  const state = useSelector(selectNotificationsPanelState);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, refetch]);

  useEffect(() => {
    if (state) {
      dispatch(closeNotificationsPanel({}));
    }
  }, [location, dispatch]);

  function handleDismiss(id) {
    dismissNotification(id);
  }

  return (
    <>
      {notifications?.results && notifications?.results?.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            {notifications?.results?.map((notification) => (
              <NotificationCard
                key={notification.id}
                className="mb-16"
                notification={notification}
                onClose={handleDismiss}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="text.secondary">
            {t("NO_NOTIFICATIONS")}
          </Typography>
        </div>
      )}
      {/* <div className="flex items-center justify-center py-16">
        <Button size="small" variant="outlined" onClick={demoNotification}>
          Create a notification example
        </Button>
      </div> */}
    </>
  );
}

export default Notifications;
