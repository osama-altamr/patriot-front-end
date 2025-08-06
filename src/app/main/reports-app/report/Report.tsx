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
import ReportHeader from "./ReportHeader";
import { useGetReportQuery } from "../ReportsApi";
import { useTranslation } from "react-i18next";
import ReportModel, { reportDefaultValues } from "../models/ReportModel";
import IReport from "../models/IReport";
import {
  requiredBooleanValidation,
  requiredStringValidation,
localeStringValidation,
requiredDateTimeValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function Report() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("reportsApp");
  const schema = z.object({
    name: localeStringValidation(),
type: requiredStringValidation(),
startDate: requiredDateTimeValidation(),
    
  });
  const routeParams = useParams();
  const { reportId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: report,
    isLoading,
    isError,
  } = useGetReportQuery(reportId, {
    skip: !reportId || reportId === "new",
  });

  const methods = useForm<IReport>({
    mode: "onChange",
    defaultValues: reportDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (reportId === "new") {
      reset(ReportModel({}));
    }
  }, [reportId, reset]);

  useEffect(() => {
    if (report) {
      reset({ ...report });
    }
  }, [report, reset]);

  if (isError && reportId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_REPORT`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/reports`}
          color="inherit"
        >
          {t(`GO_TO_REPORTS`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (report &&
      routeParams.reportId !== report.id &&
      routeParams.reportId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<ReportHeader />}
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
                <BasicInfoTab report={report} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Report;