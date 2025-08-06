import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Popover } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useThemeMediaQuery } from "@fuse/hooks";
import Icon from "app/shared-components/Icon";
import { useGetUnreadNotificationsQuery } from "../NotificationsApi";
import { AppDispatch } from "app/store/store";
import { toggleNotificationsPanel } from "../store/notificationsSlice";
import NotificationCard from "../notifications/NotificationCard";
import { useTranslation } from "react-i18next";

function NotificationsIcon() {
  const { t } = useTranslation("notificationsApp");
  const dispatch = useDispatch<AppDispatch>();
  const { data: notifications } = useGetUnreadNotificationsQuery();
  const iconRef = useRef();
  const [newNotification, setNewNotification] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if (notifications?.results && notifications?.results?.length > 0) {
      if (
        !newNotification ||
        newNotification.id !==
          notifications[notifications.results.length - 1].id
      ) {
        setNewNotification(notifications[notifications.results.length - 1]);
        // const audio = new Audio("/assets/wav/notification.mp3");
        // audio.play();
        // handleOpenNewNotification();
      }
    }
  }, [notifications]);
  const handleOpenNewNotification = () => {
    setAnchorEl(iconRef.current);
    setTimeout(() => {
      handleCloseNewNotification();
    }, 10000);
  };

  const handleCloseNewNotification = () => {
    setAnchorEl(null);
  };

  const openNewNotification = Boolean(anchorEl);
  const id = openNewNotification ? "simple-popover" : undefined;
  function handleDismiss(id) {
    handleCloseNewNotification();
  }
  return (
    <div>
      <IconButton
        className="border border-divider"
        onClick={(ev) => dispatch(toggleNotificationsPanel({}))}
        ref={iconRef}
        sx={{
          color: (theme) => theme.palette.action as any,
          bgcolor: (theme) => theme.palette.background.paper,
        }}
      >
        <Badge
          color="info"
          variant="dot"
          invisible={
            !notifications?.results || notifications?.results?.length === 0
          }
        >
          <Icon type="fa6" name="FaBell" size="0.8em" />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={openNewNotification}
        anchorEl={anchorEl}
        onClose={handleCloseNewNotification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <NotificationCard
          notification={newNotification}
          onClose={handleDismiss}
        />
      </Popover>
    </div>
  );
}

NotificationsIcon.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>,
};

export default NotificationsIcon;
