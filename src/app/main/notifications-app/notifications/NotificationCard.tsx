import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useTranslation } from "react-i18next";
import INotification from "../models/INotification";
import { toNotificationTypeIcon } from "../Utils";

function NotificationCard({
  notification,
  onClose,
  className = "",
}: {
  notification: INotification;
  onClose?: (id: string) => void;
  className?: string;
}) {
  const { t } = useTranslation("notificationsApp");
  const variant = notification?.variant || "";

  const handleClose = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    onClose?.(notification.id);
  };

  return (
    <Card
      className={clsx(
        "flex notifications-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8",
        variant === "success" && "bg-green-600 text-white",
        variant === "info" && "bg-blue-700 text-white",
        variant === "error" && "bg-red-600 text-white",
        variant === "warning" && "bg-orange-600 text-white",
        className
      )}
      elevation={0}
      component={notification.link ? NavLinkAdapter : "div"}
      to={notification.link || ""}
      role={notification.link && "button"}
    >
      <Box
        sx={{ backgroundColor: "background.paper" }}
        className="flex shrink-0 notifications-center justify-center w-32 h-32 me-8 rounded-full"
      >
        <FuseSvgIcon className="opacity-75" color="secondary">
          {toNotificationTypeIcon(notification.type)}
        </FuseSvgIcon>
      </Box>

      <div className="flex flex-col flex-auto">
        <Typography className="font-semibold line-clamp-1">
          {notification.title ?? t("NOTIFICATION")}
        </Typography>

        {notification.content && (
          <div
            className="text-13"
            // className="line-clamp-2"
            // dangerouslySetInnerHTML={{ __html: notification.content }}
          >
            {notification.content}
          </div>
        )}

        <Typography
          className="mt-8 text-sm leading-none "
          color="text.secondary"
        >
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </Typography>
      </div>

      <IconButton
        disableRipple
        className="top-0 end-0 absolute p-16"
        color="inherit"
        size="small"
        onClick={handleClose}
      >
        <FuseSvgIcon size={15} className="opacity-75" color="inherit">
          heroicons-solid:x
        </FuseSvgIcon>
      </IconButton>
    </Card>
  );
}

export default NotificationCard;
