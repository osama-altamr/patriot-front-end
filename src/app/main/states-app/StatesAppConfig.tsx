import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "statesApp", en);
i18next.addResourceBundle("ar", "statesApp", ar);
const States = lazy(() => import("./states/States"));
const State = lazy(() => import("./state/State"));

const StatesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "states",
      element: <States />,
    },
    {
      path: "states/:stateId",
      element: <State />,
    },
  ],
};

export default StatesAppConfig;