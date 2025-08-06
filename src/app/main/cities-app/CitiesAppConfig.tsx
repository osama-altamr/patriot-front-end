import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "citiesApp", en);
i18next.addResourceBundle("ar", "citiesApp", ar);
const Cities = lazy(() => import("./cities/Cities"));
const City = lazy(() => import("./city/City"));

const CitiesAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "cities",
      element: <Cities />,
    },
    {
      path: "cities/:cityId",
      element: <City />,
    },
  ],
};

export default CitiesAppConfig;