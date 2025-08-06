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
import MaterialHeader from "./MaterialHeader";
import { useGetMaterialQuery } from "../MaterialsApi";
import { useTranslation } from "react-i18next";
import MaterialModel, { materialDefaultValues } from "../models/MaterialModel";
import IMaterial from "../models/IMaterial";
import {
  requiredBooleanValidation,
  optionalStringValidation,
localeStringValidation,
requiredNumberValidation,
optionalNumberValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function Material() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("materialsApp");
  const schema = z.object({
    name: localeStringValidation(),
description: localeStringValidation({ requiredLanguages: [] }),
imageUrl: optionalStringValidation(),
height: optionalNumberValidation({ positive: true, nonZero: true }),
width: optionalNumberValidation({ positive: true, nonZero: true }),
quantity: requiredNumberValidation({ positive: true, nonZero: true }),
location: optionalStringValidation(),
glassType: optionalStringValidation(),
    
  });
  const routeParams = useParams();
  const { materialId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: material,
    isLoading,
    isError,
  } = useGetMaterialQuery(materialId, {
    skip: !materialId || materialId === "new",
  });

  const methods = useForm<IMaterial>({
    mode: "onChange",
    defaultValues: materialDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (materialId === "new") {
      reset(MaterialModel({}));
    }
  }, [materialId, reset]);

  useEffect(() => {
    if (material) {
      reset({ ...material });
    }
  }, [material, reset]);

  if (isError && materialId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_MATERIAL`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/materials`}
          color="inherit"
        >
          {t(`GO_TO_MATERIALS`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (material &&
      routeParams.materialId !== material.id &&
      routeParams.materialId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<MaterialHeader />}
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
                <BasicInfoTab material={material} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Material;