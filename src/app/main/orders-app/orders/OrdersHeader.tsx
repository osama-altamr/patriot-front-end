import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useTranslation } from "react-i18next";
import { Input, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "app/store/store";
import {
  selectOrdersDateFromFilter,
  selectOrdersDateToFilter,
  selectOrdersSearchText,
  setOrdersDateFromFilter,
  setOrdersDateToFilter,
  setOrdersSearchText,
  ordersInitialState,
  selectOrdersPriorityFilter,
  setOrdersPriorityFilter,
  selectOrdersStatusFilter,
  setOrdersStatusFilter,
  selectOrdersUserIdFilter,
  setOrdersUserIdFilter,
  selectOrdersDriverIdFilter,
  setOrdersDriverIdFilter,
} from "../store/ordersSlice";
import FilterIcon from "app/shared-components/filter-icon/FilterIcon";
import { FilterTypes } from "app/shared-components/filter-icon/Utils";
import _ from "lodash";
import { orderPriority, toOrderPriorityTitle, orderStatus, toOrderStatusTitle } from "../Utils";

function OrdersHeader() {
  const { t } = useTranslation("ordersApp");
  const dispatch = useDispatch<AppDispatch>();
  
  const searchText = useSelector(selectOrdersSearchText);
  const priorityFilter = useSelector(selectOrdersPriorityFilter);
  const statusFilter = useSelector(selectOrdersStatusFilter);
  const userIdFilter = useSelector(selectOrdersUserIdFilter);
  const driverIdFilter = useSelector(selectOrdersDriverIdFilter);
  const dateFromFilter = useSelector(selectOrdersDateFromFilter);
  const dateToFilter = useSelector(selectOrdersDateToFilter);

  const filters = [
    {
      type: FilterTypes.dropdown,
      title: t("PRIORITY"),
      value: priorityFilter,
      onChange: (e) => dispatch(setOrdersPriorityFilter(e)),
      items: [
        { label: t("ALL"), value: "all" },
        ...Object.values(orderPriority).map((i) => ({
          label: t(toOrderPriorityTitle(i)),
          value: i,
        })),
      ],
      closeOnChange: false,
    },
    {
      type: FilterTypes.dropdown,
      title: t("STATUS"),
      value: statusFilter,
      onChange: (e) => dispatch(setOrdersStatusFilter(e)),
      items: [
        { label: t("ALL"), value: "all" },
        ...Object.values(orderStatus).map((i) => ({
          label: t(toOrderStatusTitle(i)),
          value: i,
        })),
      ],
      closeOnChange: false,
    },
    {
      type: FilterTypes.autocomplete,
      title: t("USER"),
      value: userIdFilter,
      onChange: (val) => dispatch(setOrdersUserIdFilter(val)),
      getItemUrl: `v1/users`,
      getItemsUrl: `v1/users`,
      closeOnChange: false,
    },
    {
      type: FilterTypes.autocomplete,
      title: t("DRIVER"),
      value: driverIdFilter,
      onChange: (val) => dispatch(setOrdersDriverIdFilter(val)),
      getItemUrl: `v1/users`,
      getItemsUrl: `v1/users`, // You might want to add a filter e.g., ?role=driver
      closeOnChange: false,
    },
    {
      type: FilterTypes.dateTime,
      title: t("START_DATE"),
      value: dateFromFilter,
      onChange: (val) => dispatch(setOrdersDateFromFilter(val)),
      maxDate: dateToFilter,
      closeOnChange: false,
      disableTime: true,
    },
    {
      type: FilterTypes.dateTime,
      title: t("END_DATE"),
      value: dateToFilter,
      onChange: (val) => dispatch(setOrdersDateToFilter(val)),
      minDate: dateFromFilter,
      closeOnChange: false,
      disableTime: true,
    },
  ];

  const changesCount = [
    !_.isEqual(priorityFilter, ordersInitialState.priorityFilter),
    !_.isEqual(statusFilter, ordersInitialState.statusFilter),
    !_.isEqual(userIdFilter, ordersInitialState.userIdFilter),
    !_.isEqual(driverIdFilter, ordersInitialState.driverIdFilter),
    !_.isEqual(dateFromFilter, ordersInitialState.dateFromFilter),
    !_.isEqual(dateToFilter, ordersInitialState.dateToFilter),
  ].filter(Boolean).length;

  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.2 } }}>
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          {t("ORDERS")}
        </Typography>
      </motion.span>

      <div className="flex flex-1 items-center justify-end space-x-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.3 } }}>
          <FilterIcon filters={filters} changesCount={changesCount} />
        </motion.div>
        
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.3 } }}>
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
            style={{ borderRadius: 8 }}
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
            <Input
              placeholder={t("SEARCH_ORDERS")}
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{ "aria-label": "Search" }}
              onChange={(ev) => dispatch(setOrdersSearchText(ev))}
            />
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
          <Button
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to="/orders/new"
            startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
          >
            {t("ADD_ORDER")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default OrdersHeader;