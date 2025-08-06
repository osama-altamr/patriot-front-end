import { FuseRouteConfigType } from "@fuse/utils/FuseUtils";
import i18next from "i18next";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetCodeSentPage from "./ResetCodeSentPage";
import ResetPasswordPage from "./ResetPasswordPage";
import en from "./i18n/en";
import ar from "./i18n/ar";
import { authRoles } from "src/app/auth";
i18next.addResourceBundle("en", "forgotPassword", en);
i18next.addResourceBundle("ar", "forgotPassword", ar);

const ForgotPasswordConfig: FuseRouteConfigType = {
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
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "reset-code-sent",
      element: <ResetCodeSentPage />,
    },
    {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
  ],
};

export default ForgotPasswordConfig;
