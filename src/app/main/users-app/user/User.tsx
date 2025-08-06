import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserHeader from "./UserHeader";
import { useGetUserQuery } from "../UsersApi";
import { useTranslation } from "react-i18next";
import UserModel, { userDefaultValues } from "../models/UserModel";
import IUser from "../models/IUser";
import {
  requiredBooleanValidation,
  requiredStringValidation,
optionalStringValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function User() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("usersApp");
  const schema = z.object({
    name: requiredStringValidation(),
email: requiredStringValidation(),
phoneNumber: optionalStringValidation(),
photoUrl: optionalStringValidation(),
role: requiredStringValidation(),
    
  });
  const routeParams = useParams();
  const { userId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUserQuery(userId, {
    skip: !userId || userId === "new",
  });

  const methods = useForm<IUser>({
    mode: "onChange",
    defaultValues: userDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (userId === "new") {
      reset(UserModel({}));
    }
  }, [userId, reset]);

  useEffect(() => {
    if (user) {
      reset({ ...user });
    }
  }, [user, reset]);

  if (isError && userId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_USER`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/users`}
          color="inherit"
        >
          {t(`GO_TO_USERS`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (user &&
      routeParams.userId !== user.id &&
      routeParams.userId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<UserHeader />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label={t("BASIC_INFO")} />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-4xl">
              <div className={tabValue !== 0 ? "hidden" : ""}>
                <BasicInfoTab user={user} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default User;