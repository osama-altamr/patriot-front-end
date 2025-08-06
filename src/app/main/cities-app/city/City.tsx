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
import CityHeader from "./CityHeader";
import { useGetCityQuery } from "../CitiesApi";
import { useTranslation } from "react-i18next";
import CityModel, { cityDefaultValues } from "../models/CityModel";
import ICity from "../models/ICity";
import {
  requiredBooleanValidation,
  requiredStringValidation,
localeStringValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function City() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("citiesApp");
  const schema = z.object({
    stateId: requiredStringValidation(),
name: localeStringValidation(),
    active: requiredBooleanValidation(),
  });
  const routeParams = useParams();
  const { cityId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: city,
    isLoading,
    isError,
  } = useGetCityQuery(cityId, {
    skip: !cityId || cityId === "new",
  });

  const methods = useForm<ICity>({
    mode: "onChange",
    defaultValues: cityDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (cityId === "new") {
      reset(CityModel({}));
    }
  }, [cityId, reset]);

  useEffect(() => {
    if (city) {
      reset({ ...city });
    }
  }, [city, reset]);

  if (isError && cityId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_CITY`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/cities`}
          color="inherit"
        >
          {t(`GO_TO_CITIES`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (city &&
      routeParams.cityId !== city.id &&
      routeParams.cityId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CityHeader />}
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
                <BasicInfoTab city={city} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default City;