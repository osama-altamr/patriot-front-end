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
import OperationHeader from "./OperationHeader";
import { useGetOperationQuery } from "../OperationsApi";
import { useTranslation } from "react-i18next";
import OperationModel, { operationDefaultValues } from "../models/OperationModel";
import IOperation from "../models/IOperation";
import {
  requiredBooleanValidation,
  
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function Operation() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("operationsApp");
  const schema = z.object({
    
    
  });
  const routeParams = useParams();
  const { operationId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: operation,
    isLoading,
    isError,
  } = useGetOperationQuery(operationId, {
    skip: !operationId || operationId === "new",
  });

  const methods = useForm<IOperation>({
    mode: "onChange",
    defaultValues: operationDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (operationId === "new") {
      reset(OperationModel({}));
    }
  }, [operationId, reset]);

  useEffect(() => {
    if (operation) {
      reset({ ...operation });
    }
  }, [operation, reset]);

  if (isError && operationId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_OPERATION`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/operations`}
          color="inherit"
        >
          {t(`GO_TO_OPERATIONS`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (operation &&
      routeParams.operationId !== operation.id &&
      routeParams.operationId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<OperationHeader />}
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
                <BasicInfoTab operation={operation} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Operation;