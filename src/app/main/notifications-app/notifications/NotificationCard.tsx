import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useTranslation } from "react-i18next";
// Import the new LocaleString type for type-safety
import INotification, { LocaleString } from "../models/INotification";
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
  // FIX 1: Destructure `i18n` from the hook to access the current language
  const { t, i18n } = useTranslation("notificationsApp");
  const currentLang = i18n.language as keyof LocaleString; // e.g., 'en' or 'ar'

  const variant = notification?.variant;

  const handleClose = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    onClose?.(notification.id);
  };

  const isLink = notification.recordId 
  const Component = isLink ? NavLinkAdapter : "div";

  console.log(`${notification.type}s/${notification.recordId}`)
  return (
    <Card
      className={clsx(
        "flex items-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8",
        variant === "success" && "bg-green-600 text-white",
        variant === "info" && "bg-blue-700 text-white",
        variant === "error" && "bg-red-600 text-white",
        variant === "warning" && "bg-orange-600 text-white",
        className
      )}
      elevation={0}
      component={Component}
      {...(isLink && { to: `${notification.type}s/${notification.recordId}`, role: "button" })}
    >
      <Box
        sx={{ backgroundColor: "background.paper" }}
        className="flex shrink-0 items-center justify-center w-32 h-32 me-8 rounded-full"
      >
        <FuseSvgIcon className="opacity-75" color="secondary">
          {toNotificationTypeIcon(notification.type)}
        </FuseSvgIcon>
      </Box>

      <div className="flex flex-col flex-auto">
        <Typography className="font-semibold line-clamp-1">
          {/* FIX 2: Select the string for the current language. Fallback to 'en', then to a generic term. */}
          {notification.title?.[currentLang] ||
            notification.title?.en ||
            t("NOTIFICATION")}
        </Typography>

        {notification.content && (
          <Typography className="text-13 line-clamp-2">
            {/* FIX 3: Do the same for the content. Fallback to 'en'. */}
            {notification.content[currentLang] || notification.content.en}
          </Typography>
        )}

        {notification.createdAt && (
          <Typography
            className="mt-8 text-sm leading-none"
            color="text.secondary"
          >
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </Typography>
        )}
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