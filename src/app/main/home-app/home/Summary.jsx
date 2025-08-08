import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Box } from "@mui/material";
import Icon from "app/shared-components/Icon";

const colorPalette = {
  purple: { main: '#6B21A8', light: '#F3E8FF' },
  amber: { main: '#B45309', light: '#FFFBEB' },
  blue: { main: '#1E40AF', light: '#EFF6FF' },
  green: { main: '#15803D', light: '#F0FDF4' },
  // ADD THESE NEW COLORS BELOW
  teal: { main: '#0D9488', light: '#F0FDFA' },   // For Categories
  red: { main: '#B91C1C', light: '#FEF2F2' },      // For Complaints
  indigo: { main: '#4338CA', light: '#EEF2FF' }, // For Reports
  cyan: { main: '#0891B2', light: '#ECFEFF' },    // For Stages
};

function Summary({
  count,
  to = "",
  color = "",
  backgroundColor = "",
  containerSx = null,
  className = "",
  titleClassName = "text-sm sm:text-lg",
  countClassName = "text-5xl sm:text-7xl",
  iconSize = "1.1em",
  iconName,
}) {
  const { t } = useTranslation("homeApp");
  return (
    <Paper
      component={Link}
      className={clsx(
        "flex flex-col flex-auto shadow rounded-2xl overflow-hidden h-200",
        className
      )}
      to={to}
    >
      <Box
        component="div"
        className={clsx(
          "flex flex-col items-center justify-center py-32 px-24 rounded-2xl relative h-full space-y-24",
          backgroundColor,
          color
        )}
        sx={containerSx}
      >
        {/* <IconButton
          component={Link}
          to={to}
          aria-label="more"
          // size={iconSize}
          className="absolute top-5 right-5"
          color="inherit"
        >
          <Icon
            type={icon.split("-")[0]}
            name={icon.split("-")[1]}
            size={iconSize}
          />
        </IconButton> */}
        <Icon type="fa6" name={iconName} size="2.5em" />
        <Typography
          className={clsx(
            "font-semibold leading-none tracking-tight",
            countClassName
          )}
          textAlign="center"
        >
          {count}
        </Typography>
        {/* <Typography
          textAlign="center"
          className={clsx("mt-4 font-medium", titleClassName)}
        >
          {t(title)}
        </Typography> */}
      </Box>
    </Paper>
  );
}

export default memo(Summary);
