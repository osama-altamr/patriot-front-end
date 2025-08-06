import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "materialsApp", en);
i18next.addResourceBundle("ar", "materialsApp", ar);
const Materials = lazy(() => import("./materials/Materials"));
const Material = lazy(() => import("./material/Material"));

const MaterialsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "materials",
      element: <Materials />,
    },
    {
      path: "materials/:materialId",
      element: <Material />,
    },
  ],
};

export default MaterialsAppConfig;