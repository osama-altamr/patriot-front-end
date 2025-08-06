import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "stagesApp", en);
i18next.addResourceBundle("ar", "stagesApp", ar);
const Stages = lazy(() => import("./stages/Stages"));
const Stage = lazy(() => import("./stage/Stage"));

const StagesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "stages",
      element: <Stages />,
    },
    {
      path: "stages/:stageId",
      element: <Stage />,
    },
  ],
};

export default StagesAppConfig;