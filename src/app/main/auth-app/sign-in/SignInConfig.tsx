import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import i18next from "i18next";
import SignInPage from "./SignInPage";
import SignInWithEmailPage from "./SignInWithEmailPage";
import en from "./i18n/en";
import ar from "./i18n/ar";
import { authRoles } from "src/app/auth";
i18next.addResourceBundle("en", "signIn", en);
i18next.addResourceBundle("ar", "signIn", ar);

const SignInConfig: FuseRouteConfigType = {
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
      path: "sign-in",
      element: <SignInPage />,
    },
    {
      path: "sign-in-using-email",
      element: <SignInWithEmailPage />,
    },
  ],
};

export default SignInConfig;
