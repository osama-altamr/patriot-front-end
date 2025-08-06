import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import withReducer from "app/store/withReducer";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "app/store/store";
import Notifications from "../notifications/Notifications";
import {
  closeNotificationsPanel,
  selectNotificationsPanelState,
  toggleNotificationsPanel,
} from "../store/notificationsSlice";
import { Button, Typography } from "@mui/material";
import {
  useDismissAllNotificationsMutation,
  useGetUnreadNotificationsQuery,
} from "../NotificationsApi";
import { LoadingButton } from "@mui/lab";

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.background.default,
    width: 400,
  },
}));

function NotificationPanel(props) {
  const { t } = useTranslation("notificationsApp");
  const dispatch = useDispatch<AppDispatch>();
  const { data: notifications } = useGetUnreadNotificationsQuery();
  const [dismissAllNotifications] = useDismissAllNotificationsMutation();
  const state: boolean = useSelector(selectNotificationsPanelState);
  const [loadingDismissAll, setLoadingDismissAll] = useState(false);

  function handleClose() {
    dispatch(closeNotificationsPanel({}));
  }
  function handleDismissAll() {
    setLoadingDismissAll(true);
    dismissAllNotifications(
      notifications?.results?.map((notification) => notification.id) ?? []
    )
      .unwrap()
      .finally(() => setLoadingDismissAll(false));
  }

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleNotificationsPanel({}))}
    >
      <div className="flex justify-between items-center px-20 py-16">
        <Typography className="text-28 font-semibold leading-none">
          {t("NOTIFICATIONS")}
        </Typography>
        <div className="flex items-center space-x-8">
          <LoadingButton
            // variant="outlined"
            color="secondary"
            size="small"
            onClick={handleDismissAll}
            loading={loadingDismissAll}
            loadingIndicator={t("DISMISSING")}
          >
            <span>{t("DISMISS_ALL")}</span>
          </LoadingButton>
          <IconButton
            className="border border-divider"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.action as any,
              bgcolor: (theme) => theme.palette.background.paper,
            }}
          >
            <FuseSvgIcon color="inherit">heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </div>
      </div>

      <Notifications />
      {/* <div className="flex items-center justify-center py-16">
        <Button size="small" variant="outlined" onClick={demoNotification}>
          Create a notification example
        </Button>
      </div> */}
    </StyledSwipeableDrawer>
  );
}

export default memo(NotificationPanel);
