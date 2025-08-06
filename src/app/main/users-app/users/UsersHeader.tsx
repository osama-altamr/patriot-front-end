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
  selectUsersDateFromFilter,
  selectUsersDateToFilter,
  selectUsersSearchText,
  setUsersDateFromFilter,
  setUsersDateToFilter,
  setUsersSearchText,
  usersInitialState,
  
  selectUsersRoleFilter,
  setUsersRoleFilter,
} from "../store/usersSlice";
import FilterIcon from "app/shared-components/filter-icon/FilterIcon";
import { FilterTypes } from "app/shared-components/filter-icon/Utils";
import _ from "lodash";
import localeString from "src/app/main/utils/localeString";
import { useAppSelector } from "app/store/hooks";
import { selectUser } from "src/app/auth/user/store/userSlice";
import {userRole,
toUserRoleTitle,
toUserRoleColor,} from "../Utils";

/**
 * The Users header.
 */

function UsersHeader() {
  const { t } = useTranslation("usersApp");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const searchText = useSelector(selectUsersSearchText);
  
  const roleFilter = useSelector(selectUsersRoleFilter);
  const dateFromFilter = useSelector(selectUsersDateFromFilter);
  const dateToFilter = useSelector(selectUsersDateToFilter);
  
  
  function handleChangeRoleFilter(event) {
    dispatch(setUsersRoleFilter(event));
  }
  function handleChangeDateFromFilter(event) {
    dispatch(setUsersDateFromFilter(event));
  }
  function handleChangeDateToFilter(event) {
    dispatch(setUsersDateToFilter(event));
  }
  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          {t("USERS")}
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
title: t("ROLE"),
value: roleFilter,
onChange: handleChangeRoleFilter,
items: [
                  { label: t("ALL"), value: "all" },
                  ...Object.values(userRole).map((i) => ({
                    label: t(toUserRoleTitle(i)),
                    value: i,
                  })),
                ],
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
                
                !_.isEqual(dateFromFilter, usersInitialState.dateFromFilter),
                !_.isEqual(dateToFilter, usersInitialState.dateToFilter),
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
              placeholder={t("SEARCH_USERS")}
              className="flex flex-1"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                "aria-label": "Search",
              }}
              onChange={(ev) => {
                dispatch(setUsersSearchText(ev));
              }}
            />
          </Paper>
        </motion.div>
        
      </div>
    </div>
  );
}

export default UsersHeader;