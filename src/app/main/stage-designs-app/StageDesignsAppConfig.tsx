import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "stageDesignsApp", en);
i18next.addResourceBundle("ar", "stageDesignsApp", ar);
const StageDesigns = lazy(() => import("./stage-designs/StageDesigns"));
const StageDesign = lazy(() => import("./stage-design/StageDesign"));

const StageDesignsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "stage-designs",
      element: <StageDesigns />,
    },
    {
      path: "stage-designs/:stageDesignId",
      element: <StageDesign />,
    },
  ],
};

export default StageDesignsAppConfig;