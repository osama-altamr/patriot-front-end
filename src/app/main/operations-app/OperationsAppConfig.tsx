import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "operationsApp", en);
i18next.addResourceBundle("ar", "operationsApp", ar);
const Operations = lazy(() => import("./operations/Operations"));
const Operation = lazy(() => import("./operation/Operation"));

const OperationsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "operations",
      element: <Operations />,
    },
    {
      path: "operations/:operationId",
      element: <Operation />,
    },
  ],
};

export default OperationsAppConfig;