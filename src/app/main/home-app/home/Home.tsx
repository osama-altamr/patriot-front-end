import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import HomeHeader from "./HomeHeader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Paper, Box, Typography } from "@mui/material";
import { useGetHomeQuery } from "../../users-app/UsersApi";
import { Link } from "react-router-dom";

// Import all icons from Font Awesome 6, allowing for dynamic selection
import * as FaIcons from "react-icons/fa6";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

// A type for our dynamic icons
type IconName = keyof typeof FaIcons;

// A type for the colors, using MUI's palette keys and our custom ones
type ColorName =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success"
  | "purple"
  | "amber"
  | "blue"
  | "green"
  | "teal";

// A mapping for custom color names to MUI theme colors
const colorPalette = (theme) => ({
  purple: { main: "#6B21A8", light: "#F3E8FF" },
  amber: { main: "#B45309", light: "#FFFBEB" },
  blue: { main: "#1E40AF", light: "#EFF6FF" },
  green: { main: "#15803D", light: "#F0FDF4" },
  teal: { main: "#0D9488", light: "#F0FDFA" },
});

/**
 * The Re-designed, beautiful Summary Widget.
 */
function Summary(props: {
  count: number;
  title: string;
  to: string;
  color: ColorName;
  iconName: IconName;
}) {
  const { count, title, to, color, iconName } = props;

  const IconComponent = FaIcons[iconName];

  return (
    <Paper
      component={Link}
      to={to}
      className="flex flex-col flex-auto p-24 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200"
      sx={(theme) => ({
        textDecoration: "none",
        backgroundColor: colorPalette(theme)[color]?.light || theme.palette[color].light,
        color: colorPalette(theme)[color]?.main || theme.palette[color].main,
      })}
    >
      <div className="flex items-center">
        <Box
          sx={{
            backgroundColor: (theme) => colorPalette(theme)[color]?.main || theme.palette[color].main,
            color: (theme) => theme.palette.getContrastText(colorPalette(theme)[color]?.main || theme.palette[color].main),
          }}
          className="flex items-center justify-center w-56 h-56 rounded-xl"
        >
          {IconComponent && <IconComponent size={32} />}
        </Box>
        <div className="ml-16">
          <Typography className="text-xl font-medium leading-5" color="text.secondary">
            {title}
          </Typography>
          <Typography className="text-4xl font-bold tracking-tight mt-4">
            {count.toLocaleString()}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}

/**
 * The Home page, with a layout that better fills the screen.
 */
function Home() {
  const { t } = useTranslation("homeApp");
  const currentMonth = new Date().getMonth() + 1;
  const { data: homeData } = useGetHomeQuery({ month: currentMonth });

  const container = {
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Root
      header={<HomeHeader />}
      content={
        <div className="w-full p-12 sm:p-24">
          <motion.div
            // THE FIX: This new grid layout makes the widgets wider on most desktop screens to fill the page.
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-48 w-full mt-32"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* All Summary components remain exactly the same */}
            <motion.div variants={item}>
              <Summary
                title={t("USERS")}
                count={homeData?.totals?.users ?? 0}
                to="/users"
                color="purple"
                iconName="FaUsers"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("PRODUCTS")}
                count={homeData?.totals?.products ?? 0}
                to="/products"
                color="amber"
                iconName="FaShirt"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("MATERIALS")}
                count={homeData?.totals?.materials ?? 0}
                to="/materials"
                color="blue"
                iconName="FaLayerGroup"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("ORDERS")}
                count={homeData?.totals?.orders ?? 0}
                to="/orders"
                color="green"
                iconName="FaFileInvoiceDollar"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("CATEGORIES")}
                count={homeData?.totals?.categories ?? 0}
                to="/categories"
                color="amber"
                iconName="FaShapes"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("COMPLAINTS")}
                count={homeData?.totals?.complaints ?? 0}
                to="/complaints"
                color="error"
                iconName="FaCommentDots"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("REPORTS")}
                count={homeData?.totals?.reports ?? 0}
                to="/reports"
                color="purple"
                iconName="FaChartPie"
              />
            </motion.div>
            <motion.div variants={item}>
              <Summary
                title={t("STAGES")}
                count={homeData?.totals?.stages ?? 0}
                to="/stages"
                color="teal"
                iconName="FaListCheck"
              />
            </motion.div>
          </motion.div>
        </div>
      }
    />
  );
}

export default Home;