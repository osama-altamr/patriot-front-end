import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import SignOutPage from "./SignOutPage";
import i18next from "i18next";
import en from "./i18n/en";
import ar from "./i18n/ar";
import { authRoles } from "src/app/auth";
i18next.addResourceBundle("en", "signOut", en);
i18next.addResourceBundle("ar", "signOut", ar);

const SignOutConfig: FuseRouteConfigType = {
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
  auth: authRoles.user,
  routes: [
    {
      path: "sign-out",
      element: <SignOutPage />,
    },
  ],
};

export default SignOutConfig;
