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
import StageHeader from "./StageHeader";
import { useGetStageQuery } from "../StagesApi";
import { useTranslation } from "react-i18next";
import StageModel, { stageDefaultValues } from "../models/StageModel";
import IStage from "../models/IStage";
import {
  requiredBooleanValidation,
  optionalStringValidation,
localeStringValidation,
requiredNumberValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function Stage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("stagesApp");
  const schema = z.object({
    name: localeStringValidation(),
description: localeStringValidation({ requiredLanguages: [] }),
imageUrl: optionalStringValidation(),
estimatedTimeMinutes: requiredNumberValidation({ positive: true, nonZero: true }),
    
  });
  const routeParams = useParams();
  const { stageId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: stage,
    isLoading,
    isError,
  } = useGetStageQuery(stageId, {
    skip: !stageId || stageId === "new",
  });

  const methods = useForm<IStage>({
    mode: "onChange",
    defaultValues: stageDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (stageId === "new") {
      reset(StageModel({}));
    }
  }, [stageId, reset]);

  useEffect(() => {
    if (stage) {
      reset({ ...stage });
    }
  }, [stage, reset]);

  if (isError && stageId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_FACTOR_STAGE`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/stages`}
          color="inherit"
        >
          {t(`GO_TO_FACTOR_STAGES`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (stage &&
      routeParams.stageId !== stage.id &&
      routeParams.stageId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<StageHeader />}
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
                <BasicInfoTab stage={stage} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Stage;