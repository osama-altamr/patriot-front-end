import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { useTranslation } from "react-i18next";
import { Input, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "app/store/store";
import { useSelector } from "react-redux";
import {
  selectComplaintsDateFromFilter,
  selectComplaintsDateToFilter,
  selectComplaintsSearchText,
  setComplaintsDateFromFilter,
  setComplaintsDateToFilter,
  setComplaintsSearchText,
  complaintsInitialState,
  
  selectComplaintsTypeFilter,
  setComplaintsTypeFilter,
selectComplaintsStatusFilter,
  setComplaintsStatusFilter,
selectComplaintsUserIdFilter,
  setComplaintsUserIdFilter,
selectComplaintsClosedByIdFilter,
  setComplaintsClosedByIdFilter,
} from "../store/complaintsSlice";
import FilterIcon from "app/shared-components/filter-icon/FilterIcon";
import { FilterTypes } from "app/shared-components/filter-icon/Utils";
import _ from "lodash";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {complaintType,
toComplaintTypeTitle,
toComplaintTypeColor,
complaintStatus,
toComplaintStatusTitle,
toComplaintStatusColor,} from "../Utils";

/**
 * The Complaints header.
 */

function ComplaintsHeader() {
  const { t } = useTranslation("complaintsApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const searchText = useSelector(selectComplaintsSearchText);
  
  const typeFilter = useSelector(selectComplaintsTypeFilter);
const statusFilter = useSelector(selectComplaintsStatusFilter);
const userIdFilter = useSelector(selectComplaintsUserIdFilter);
const closedByIdFilter = useSelector(selectComplaintsClosedByIdFilter);
  const dateFromFilter = useSelector(selectComplaintsDateFromFilter);
  const dateToFilter = useSelector(selectComplaintsDateToFilter);
  
  
  function handleChangeTypeFilter(event) {
    dispatch(setComplaintsTypeFilter(event));
  }
function handleChangeStatusFilter(event) {
    dispatch(setComplaintsStatusFilter(event));
  }
function handleChangeUserIdFilter(event) {
    dispatch(setComplaintsUserIdFilter(event));
  }
function handleChangeClosedByIdFilter(event) {
    dispatch(setComplaintsClosedByIdFilter(event));
  }
  function handleChangeDateFromFilter(event) {
    dispatch(setComplaintsDateFromFilter(event));
  }
  function handleChangeDateToFilter(event) {
    dispatch(setComplaintsDateToFilter(event));
  }
  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          {t("COMPLAINTS")}
        </Typography>
      </motion.span>

      <div className="flex flex-1 items-center justify-end space-x-8">
        <motion.div
          className="flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.3 } }}
        >
          <FilterIcon
            filters={[
              
              {
    type: FilterTypes.dropdown,
title: t("TYPE"),
value: typeFilter,
onChange: handleChangeTypeFilter,
items: [
                  { label: t("ALL"), value: "all" },
                  ...Object.values(complaintType).map((i) => ({
                    label: t(toComplaintTypeTitle(i)),
                    value: i,
                  })),
                ],
closeOnChange: false,
  },
{
    type: FilterTypes.dropdown,
title: t("STATUS"),
value: statusFilter,
onChange: handleChangeStatusFilter,
items: [
                  { label: t("ALL"), value: "all" },
                  ...Object.values(complaintStatus).map((i) => ({
                    label: t(toComplaintStatusTitle(i)),
                    value: i,
                  })),
                ],
closeOnChange: false,
  },
{
    type: FilterTypes.autocomplete,
title: t("USER"),
value: userIdFilter,
onChange: handleChangeUserIdFilter,
getItemUrl: `v1/users`,
getItemsUrl: `v1/users`,
closeOnChange: false,
  },
{
    type: FilterTypes.autocomplete,
title: t("CLOSED_BY"),
value: closedByIdFilter,
onChange: handleChangeClosedByIdFilter,
getItemUrl: `v1/users`,
getItemsUrl: `v1/users`,
closeOnChange: false,
  },
              {
                type: FilterTypes.dateTime,
                title: t("START_DATE"),
                value: dateFromFilter as any,
                onChange: handleChangeDateFromFilter,
                maxDate: dateToFilter as any,
                closeOnChange: false,
                disableTime: true,
              },
              {
                type: FilterTypes.dateTime,
                title: t("END_DATE"),
                value: dateToFilter as any,
                onChange: handleChangeDateToFilter,
                minDate: dateFromFilter as any,
                closeOnChange: false,
                disableTime: true,
              },
            ]}
            changesCount={
              [
                
                !_.isEqual(dateFromFilter, complaintsInitialState.dateFromFilter),
                !_.isEqual(dateToFilter, complaintsInitialState.dateToFilter),
              ].filter(Boolean).length
            }
          />
        </motion.div>
        <motion.div
          className="flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.3 } }}
        >
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
            style={{ borderRadius: 8 }}
          >
            <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

            <Input
              placeholder={t("SEARCH_COMPLAINTS")}
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                "aria-label": "Search",
              }}
              onChange={(ev) => {
                dispatch(setComplaintsSearchText(ev));
              }}
            />
          </Paper>
        </motion.div>
        <motion.div
            className="flex flex-grow-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Button
              variant="contained"
              color="secondary"
              component={NavLinkAdapter}
              to={`/complaints/new`}
              startIcon={
                <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
              }
            >
              {t(`ADD_COMPLAINT`)}
            </Button>
          </motion.div>
      </div>
    </div>
  );
}

export default ComplaintsHeader;