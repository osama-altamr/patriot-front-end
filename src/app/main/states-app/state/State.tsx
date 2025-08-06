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
import StateHeader from "./StateHeader";
import { useGetStateQuery } from "../StatesApi";
import { useTranslation } from "react-i18next";
import StateModel, { stateDefaultValues } from "../models/StateModel";
import IState from "../models/IState";
import {
  requiredBooleanValidation,
  localeStringValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function State() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("statesApp");
  const schema = z.object({
    name: localeStringValidation(),
    isActive: requiredBooleanValidation(),
  });
  const routeParams = useParams();
  const { stateId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: state,
    isLoading,
    isError,
  } = useGetStateQuery(stateId, {
    skip: !stateId || stateId === "new",
  });

  const methods = useForm<IState>({
    mode: "onChange",
    defaultValues: stateDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (stateId === "new") {
      reset(StateModel({}));
    }
  }, [stateId, reset]);

  useEffect(() => {
    if (state) {
      reset({ ...state });
    }
  }, [state, reset]);

  if (isError && stateId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_STATE`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/states`}
          color="inherit"
        >
          {t(`GO_TO_STATES`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (state &&
      routeParams.stateId !== state.id &&
      routeParams.stateId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<StateHeader />}
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
                <BasicInfoTab state={state} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default State;