import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import i18next from "i18next";
import SignUpPage from "./SignUpPage";
import en from "./i18n/en";
import ar from "./i18n/ar";
import { authRoles } from "src/app/auth";
i18next.addResourceBundle("en", "signUp", en);
i18next.addResourceBundle("ar", "signUp", ar);

const SignUpConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "sign-up",
      element: <SignUpPage />,
    },
  ],
};

export default SignUpConfig;
