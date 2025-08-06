import { lazy } from "react";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";

i18next.addResourceBundle("en", "usersApp", en);
i18next.addResourceBundle("ar", "usersApp", ar);
const Users = lazy(() => import("./users/Users"));
const User = lazy(() => import("./user/User"));

const UsersAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "users",
      element: <Users />,
    },
    {
      path: "users/:userId",
      element: <User />,
    },
  ],
};

export default UsersAppConfig;