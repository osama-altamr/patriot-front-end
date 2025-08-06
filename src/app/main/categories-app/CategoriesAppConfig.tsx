import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "categoriesApp", en);
i18next.addResourceBundle("ar", "categoriesApp", ar);
const Categories = lazy(() => import("./categories/Categories"));
const Category = lazy(() => import("./category/Category"));

const CategoriesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "categories",
      element: <Categories />,
    },
    {
      path: "categories/:categoryId",
      element: <Category />,
    },
  ],
};

export default CategoriesAppConfig;