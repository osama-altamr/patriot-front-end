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
import CategoryHeader from "./CategoryHeader";
import { useGetCategoryQuery } from "../CategoriesApi";
import { useTranslation } from "react-i18next";
import CategoryModel, { categoryDefaultValues } from "../models/CategoryModel";
import ICategory from "../models/ICategory";
import {
  requiredBooleanValidation,
  optionalStringValidation,
localeStringValidation,
} from "src/app/main/utils/validations";
import BasicInfoTab from "./tabs/BasicInfoTab";

function Category() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const { t } = useTranslation("categoriesApp");
  const schema = z.object({
    name: localeStringValidation({ requiredLanguages: [] }),
description: localeStringValidation(),
imageUrl: optionalStringValidation(),
    
  });
  const routeParams = useParams();
  const { categoryId } = routeParams;

  const [tabValue, setTabValue] = useState(0);

  const {
    data: category,
    isLoading,
    isError,
  } = useGetCategoryQuery(categoryId, {
    skip: !categoryId || categoryId === "new",
  });

  const methods = useForm<ICategory>({
    mode: "onChange",
    defaultValues: categoryDefaultValues,
    resolver: zodResolver(schema),
  });

  const { reset, watch } = methods;

  const form = watch();

  useEffect(() => {
    if (categoryId === "new") {
      reset(CategoryModel({}));
    }
  }, [categoryId, reset]);

  useEffect(() => {
    if (category) {
      reset({ ...category });
    }
  }, [category, reset]);

  if (isError && categoryId !== "new") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          {t(`NO_CATEGORY`)}
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to={`/categories`}
          color="inherit"
        >
          {t(`GO_TO_CATEGORIES`)}
        </Button>
      </motion.div>
    );
  }

  if (
    isLoading ||
    _.isEmpty(form) ||
    (category &&
      routeParams.categoryId !== category.id &&
      routeParams.categoryId !== "new")
  ) {
    return <FuseLoading />;
  }
  function handleTabChange(event: SyntheticEvent, value: number) {
    setTabValue(value);
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CategoryHeader />}
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
                <BasicInfoTab category={category} />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default Category;